import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Prediction } from '../../model/prediction';

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent {
  imageUrl: string | ArrayBuffer | null = null;
  isDragOver: boolean = false;
  response: Prediction | undefined;
  apple: number = 0;
  tomato: number = 0;
  file: File | undefined;

  constructor(private dataService: DataService) {}

  onFileSelected(event: Event): void {
    this.file = (event.target as HTMLInputElement).files?.[0];
    this.previewFile(this.file);
    this.getPrediction();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files?.[0];
    this.previewFile(file);
  }

  private previewFile(file?: File): void {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  getPrediction(): void {
    if (!this.file) return;

    this.dataService.predictImage(this.file).subscribe(data => {
      this.response = data;
      this.response.scores.forEach(score => {
        if (score.label === 'Apple') {
          this.apple = score.score;
        } else if (score.label === 'Tomato') {
          this.tomato = score.score;
        }
      });
    })
  }
}

