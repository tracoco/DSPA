import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularapp';

  sendMessage() {
    const event = new CustomEvent('message', { detail: 'Hello from Angular!' });
    window.dispatchEvent(event);
  }
}
