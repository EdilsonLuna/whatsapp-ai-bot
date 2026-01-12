import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListSideBarComponent } from './chat-list-side-bar.component';

describe('ChatListSideBarComponent', () => {
  let component: ChatListSideBarComponent;
  let fixture: ComponentFixture<ChatListSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatListSideBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatListSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
