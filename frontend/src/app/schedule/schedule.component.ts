import * as Auth0 from 'auth0-web';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Schedule } from './schedule.model';
import { Router, ActivatedRoute } from "@angular/router";
import { ScheduleApiService } from './schedule-api.service';
import { UserProfile } from 'auth0-web/src/profile';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  getHours
} from 'date-fns';
import { Subject, Observable } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./schedule-template.html",
  styleUrls: ['schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  authenticated = false;
  user: UserProfile;
  shifts: Observable<Array<CalendarEvent<{ scheduleItem: Schedule }>>>;
  store_id: string;
  loadingSchedule: boolean;

  constructor(private router: ActivatedRoute, private scheduleApi: ScheduleApiService, private modal: NgbModal, private cdr: ChangeDetectorRef, private location: Location) { }

  ngOnInit() {
    const self = this;
    this.store_id = this.router.snapshot.paramMap.get("store_id");
    this.setViewString(this.router.snapshot.paramMap.get("view"));
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
    this.getWeekSchedule();
  }

  getWeekSchedule(): void {
    this.loadingSchedule = true;
    this.scheduleApi
      .getSchedule(this.store_id)
      .subscribe(res => {
        this.shifts = res.map((scheduleItem: Schedule) => {
          return {
            start: new Date(scheduleItem.start_date_time),
            end: new Date(scheduleItem.end_date_time),
            title: 'EmpID: ' + scheduleItem.employee_id + 'in position: ' + scheduleItem.position_id,
            color: colors.blue,
            actions: this.actions,
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
            draggable: true,
            meta: {
              scheduleItem
            }
          };
        })
        console.log(this.shifts);
        this.loadingSchedule = false;
        this.cdr.detectChanges();
      })
  }

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  dayStartHour = Math.max(6, getHours(new Date()) - 12);

  dayEndHour = 23;//Math.min(23, getHours(new Date()) + 12);

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  // eventTimesChanged({
  //   event,
  //   newStart,
  //   newEnd
  // }: CalendarEventTimesChangedEvent): void {
  //   this.shifts = this.shifts.map(iEvent => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd
  //       };
  //     }
  //     return iEvent;
  //   });
  //   //this.handleEvent('Dropped or resized', event);
  // }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
    this.location.replaceState(`/schedule/${this.store_id}/${this.view}`);
  }

  setViewString(view: string) {
    switch(view.toLowerCase()) {
      case 'month': this.setView(CalendarView.Month); break;
      case 'week': this.setView(CalendarView.Week); break;
      case 'day': this.setView(CalendarView.Day); break;
      default: this.setView(CalendarView.Month); 
    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}