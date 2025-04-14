import { Component, OnInit } from '@angular/core';
import { createWorker, Worker } from 'tesseract.js';
import Tesseract from 'tesseract.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})




export class AppComponent  {
  extractedText: string = '';
  loading: boolean = false;
  searchText = '';
  searchResult = '';
  groceryStoreList= new Array()
  ngOnInit(){
    this.groceryStoreList= [
     {storeName:"Indian Cash and Carry",price: '$100',lastTransaction: '12/23/2025'},
     {storeName:"Apna Mandi",price: '$100',lastTransaction: '12/23/2025'},
     {storeName:"Safeway",price: '$100',lastTransaction: '12/23/2025'},
     {storeName:"Walmart",price: '$100',lastTransaction: '12/23/2025'}
    ]
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = reader.result as string;
        this.performOCR(imageData);
      };

      reader.readAsDataURL(file); // Convert image to Base64 format
    }
  }

  performOCR(imageData: string): void {
    this.loading = true;

    Tesseract.recognize(
      imageData
    )
      .then(({ data: { text } }) => {
        this.extractedText = this.removeAngleBrackets(text); // Extracted text
        this.loading = false;
      })
      .catch((err) => {
        console.error('OCR Error:', err);
        this.loading = false;
      });
  }

  search() {
    if (this.extractedText.toUpperCase().includes(this.searchText.toUpperCase())) {
      this.searchResult = 'Text "' + this.searchText + '"' + 'exists. Occurences :' + this.countNumberOfOccurences();
    } else {
      this.searchResult = "Not exist"
    }
  }

  countNumberOfOccurences() {
  const regex = new RegExp(this.searchText.toUpperCase(), "g");
    return (this.extractedText.toUpperCase().match(regex) || []).length;    
  }

  removeAngleBrackets(text: string): string {
    return text.replace(/[<>]/g, ' '); 
  }
}
