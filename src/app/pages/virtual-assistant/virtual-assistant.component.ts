import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '@services/users.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-virtual-assistant',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    FormsModule,
    DividerModule,
  ],
  templateUrl: './virtual-assistant.component.html',
})
export default class VirtualAssistantComponent implements OnInit {
  public usersService = inject(UsersService);

  public prompt: string = '';
  public loadingResponse: boolean = false;

  public files = [1, 2, 3];

  public messages: { user: string; message: string }[] = [];

  ngOnInit(): void {}

  public sendPrompt() {
    if (this.prompt.length === 0) {
      const newMessage0 = {
        user: 'user',
        message: 'Reenvía el mensaje, no se pueden enviar mensajes vacíos',
      };
      this.messages.push(newMessage0);
      return;
    }

    const newMessage0 = {
      user: 'user',
      message: this.prompt,
    };
    this.messages.push(newMessage0);

    this.loadingResponse = true;

    this.usersService.getBasicPrompt(this.prompt).subscribe(
      (res) => {
        const newMessage = {
          user: 'IA',
          message:
            res.error!.text || 'Ocurrió un error al procesar tu solicitud.',
        };
        this.prompt = '';
        newMessage.message = newMessage.message.replace(
          /(\d+)\.\s*/g,
          '\n$1. '
        );
        this.messages.push(newMessage);
        console.log(res);
        this.loadingResponse = false;
        console.log(this.messages);
      },
      (error) => {
        this.prompt = '';
        const newMessage = {
          user: 'IA',
          message: error.error.text,
        };
        newMessage.message = newMessage.message.replace(
          /(\d+)\.\s*/g,
          '\n$1. '
        );
        this.messages.push(newMessage);
        console.log(this.messages);

        console.error(error.error.text);
        this.loadingResponse = false;
      }
    );
  }

  public formatMessage(message: string): string {
    return message.replace(/\n/g, '<br>');
  }
}
