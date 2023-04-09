import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class DataService {

  public mergedData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    http.get("assets/merged.json", { responseType: "json" })
      .subscribe({
        next: (response) => {
          this.mergedData$.next(Object.assign([], response));
        }
      });
  }
}
