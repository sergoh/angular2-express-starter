import { Component, ViewChild, ElementRef } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { SemanticPopupComponent } from "ng-semantic";

@Component({
    selector: "app",
    template: `
<div class="ui container">
    <nav class="ui menu inverted teal huge">
        <a routerLink="home" class="item">Home</a>
        <a routerLink="contact" class="item">Contact Me</a>
        
        <nav class="menu right">
            <a (click)="myPopup.show($event, {position: 'right center'})" *ngIf="!isLogged" class="item">Login</a>
            <a (click)="logout()" *ngIf="isLogged" class="item inverted red">Logout</a>
        </nav>
    </nav>
    
    <sm-popup class="huge" #myPopup>
        <sm-card class="card basic">
            <card-title> Simple login </card-title>
            <card-subtitle>  </card-subtitle>
            <card-content>
                <p><b>Password</b>: angualr2express</p>
                <p><b>Username</b>: john</p>
            </card-content>
            <sm-button class="bottom attached fluid primary" *ngIf="!isLogged" (click)="login()">Login</sm-button>
            <sm-button class="bottom attached fluid red" *ngIf="isLogged" (click)="logout()">Logout</sm-button>
        </sm-card>
    </sm-popup>
        
    <hello [name]="appName"></hello>
    
    <div class="ui divider"></div>
    
    <router-outlet></router-outlet>
    
    <div class="center">
        <img src='https://angular.io/resources/images/logos/standard/shield-large.png'>
    </div>
    
</div>`
})
export class AppComponent {
    appName: string = "Angular 2 Express";
    user: any = {
        password: "angualr2express",
        username: "john"
    };
    response: Response;
    isLogged: boolean;
    @ViewChild("myPopup") myPopup: SemanticPopupComponent;

    constructor(private http: Http) {
        this.isLogged = !!localStorage.getItem("id_token");
    }

    signup() {
        this.http.post("/login/signup", JSON.stringify({ password: this.user.password, username: this.user.username }), new RequestOptions({
            headers: new Headers({"Content-Type": "application/json"})
        }))
            .map((res: any) => res.json())
            .subscribe(
                (res: Response) => {
                    this.response = res;
                },
                (error: Error) => { console.log(error); }
            );
    }

    login() {
        this.http.post("/login", JSON.stringify({ password: this.user.password }), new RequestOptions({
            headers: new Headers({"Content-Type": "application/json"})
        }))
            .map((res: Response) => res.json())
            .subscribe(
                (res: Response & { jwt: string }) => {
                    localStorage.setItem("id_token", res.jwt);
                    this.myPopup.hide();
                    location.reload();
                },
                (error: Error) => { console.log(error); }
            );
    }

    logout(): void {
        localStorage.removeItem("id_token");
        location.reload();
    }
}