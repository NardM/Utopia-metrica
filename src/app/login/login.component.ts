/**
 * Angular 2 decorators and services
 */
import {
    Component, ElementRef,
    OnInit, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import { ActivatedRoute, Router }  from '@angular/router';
import { TokenService } from '../manager/http/token.serviece';
import { LoginService } from './login.service';

/**
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'login',
    styleUrls: ['./login.component.scss' ],
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    constructor(private router: Router,
                private tokenService: TokenService,
                private route: ActivatedRoute,
                private loginService: LoginService) {
        document.body.style.background = 'white';
        this.step = LoginStep.PhoneInput;
    }

    @ViewChild('#phone')
    public phone: ElementRef;
    public textButton: string = 'Отправить';
    private code: number;
    public step: LoginStep;
    private successBool: boolean = false;
    private errorCode: boolean = false;

    public postSub(phone: string, code?: number): void {
        let self = this;
        debugger;
        switch (this.step) {
            case LoginStep.PhoneInput:
                this.loginService.login(phone).then(a => {
                    debugger;
                    self.step = LoginStep.CodeInput;
                    self.errorCode = false;
                    self.successBool = true;
                    self.textButton = 'Войти';
                    // value.code = a.data.code;
                });
                break;
            case LoginStep.CodeInput:
                this.step = LoginStep.ConfirmRequest;
                this.loginService.confirm(phone, code)
                    .then(a => {
                        debugger;
                        if (a.success) {
                            this.step = LoginStep.Success;
                            this.textButton = 'Успешно';
                            this.router.navigate(['manager']);
                        }
                        else {
                            // this.step = LoginStep.BrokenConfirm;
                            // this.buttonLabel = 'Получить новый код';
                            this.step = LoginStep.CodeInput;
                            this.errorCode = true;
                        }
                    });
                break;
            default:
                break;
        }
    }
}

enum LoginStep{
    PhoneInput,LoginRequest, CodeInput,ConfirmRequest,Success,BrokenConfirm
}



/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
