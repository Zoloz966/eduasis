import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-virtual-assistant',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './virtual-assistant.component.html',
})
export default class VirtualAssistantComponent implements OnInit {

  ngOnInit(): void { }

}
