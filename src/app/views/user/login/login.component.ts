import { Component, OnInit } from '@angular/core';
import {User} from '../../../model/user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

    user = new User();

    constructor() { }

    ngOnInit() { }

}
