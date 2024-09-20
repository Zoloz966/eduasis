import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '@services/users.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-virtual-assistant',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './virtual-assistant.component.html',
})
export default class VirtualAssistantComponent implements OnInit {
  public usersService = inject(UsersService);

  public prompt: string = '';
  public loadingResponse: boolean = false;

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
        this.messages.push(newMessage);
        console.log(res);
        this.loadingResponse = false;
      },
      (error) => {
        this.prompt = '';
        const newMessage = {
          user: 'IA',
          message: error.error.text,
        };
        this.messages.push(newMessage);
        console.error(error.error.text);
        this.loadingResponse = false;
      }
    );
  }
}
