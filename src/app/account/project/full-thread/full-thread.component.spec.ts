/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FullThreadComponent } from './full-thread.component';

describe('FullThreadComponent', () => {
  let component: FullThreadComponent;
  let fixture: ComponentFixture<FullThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
