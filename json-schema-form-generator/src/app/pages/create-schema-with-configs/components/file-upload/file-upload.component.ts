import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() fileProcessed = new EventEmitter<any>();

  async onFileChange(event: any) {
    const file = event.target.files[0];

    if (!file) { return; }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const schema = JSON.parse(e.target.result);
        console.log('JSON Schema:', schema);
        this.fileProcessed.emit(schema);
      }
      catch (err) {
        console.error('Error parsing JSON:', err);
      }
    };
    reader.readAsText(file);
  }

}
