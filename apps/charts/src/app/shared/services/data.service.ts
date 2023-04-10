import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { B } from "@angular/cdk/keycodes";

@Injectable({
  providedIn: "root"
})
export class DataService {

  public mergedData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public iswData$: BehaviorSubject<any> = new BehaviorSubject(null);
  public weather$: BehaviorSubject<any> = new BehaviorSubject(null)

  constructor(private http: HttpClient) {
    http.get("assets/merged.json", { responseType: "json" })
      .subscribe({
        next: (response) => {
          this.mergedData$.next(Object.assign([], response));
        }
      });
    http.get("assets/isw.json", { responseType: "json" })
      .subscribe({
        next: (response) => {
          this.iswData$.next(Object.assign([], response));
        }
      });
  }
}
