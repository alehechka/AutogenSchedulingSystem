import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
    item: string,
    itemType: string
  }
  
  @Component({
    selector: 'delete-department-dialog',
    template: `<p mat-dialog-title>Are you sure you would like to delete the <i>{{data.item}}</i> {{data.itemType}}?</p>
    <mat-action-row>
    <button mat-button mat-raised-button color="primary" (click)="onNoClick()">
            Cancel
          </button>
        <button mat-button color="warn" [mat-dialog-close]=true>
          Delete
        </button>
        </mat-action-row>`,
  })
  export class DeleteItemDialog {
  
    constructor(
      public dialogRef: MatDialogRef<DeleteItemDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  
    
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }