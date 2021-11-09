import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators';

import { REGISTER } from '../../../account/components/register/register.graphql';
import { GetOrderByCode, Register } from '../../../common/generated-types';
import { notNullOrUndefined } from '../../../common/utils/not-null-or-undefined';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';
import { MessageService } from '../../../services/message.service';

import { GET_ORDER_BY_CODE } from './checkout-confirmation.graphql';

type Mensaje = {
    nombre: string;
    email: string;
    asunto: string;
    mensaje: string;
};

@Component({
    selector: 'vsf-checkout-confirmation',
    templateUrl: './checkout-confirmation.component.html',
    styleUrls: ['./checkout-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutConfirmationComponent implements OnInit {
    registrationSent = false;
    order$: Observable<GetOrderByCode.OrderByCode>;
    notFound$: Observable<boolean>;


    constructor(private stateService: StateService,
        private dataService: DataService,
        private changeDetector: ChangeDetectorRef,
        private route: ActivatedRoute,
        public _MessageService: MessageService) { }

    ngOnInit() {
        const orderRequest$ = this.route.paramMap.pipe(
            map(paramMap => paramMap.get('code')),
            filter(notNullOrUndefined),
            switchMap(code => this.dataService.query<GetOrderByCode.Query, GetOrderByCode.Variables>(
                GET_ORDER_BY_CODE,
                { code  },
            )),
            map(data => data.orderByCode),
            shareReplay(1),
        );
        this.order$ = orderRequest$.pipe(
            filter(notNullOrUndefined)
        );
        this.notFound$ = orderRequest$.pipe(
            map(res => !res),
        );

        //enviar correo 
        this.order$.forEach(order => {
            const customer = order?.customer;
            if (customer) {
                let msj: Mensaje = {
                    nombre: customer.firstName + " " + customer.lastName,
                    email: customer.emailAddress,
                    asunto: "Nuevo Pedido #" + order.code,
                    mensaje: "Se ha realizado un nuevo pedido con número."+ order.code +". Ingresar a https://www.compus4less.com/admin para mas información. ",
                }
                this._MessageService.sendMessage(msj).subscribe(res => {
                    if (res == 'OK') {
                        console.log("Email sended.")
                    } else {
                        console.log("Email not sended.")
                    }
                });
            }
        });
        //
    }

    register() {
        this.order$.pipe(
            take(1),
            mergeMap(order => {
                const customer = order?.customer;
                if (customer) {
                    return this.dataService.mutate<Register.Mutation, Register.Variables>(REGISTER, {
                        input: {
                            emailAddress: customer.emailAddress,
                            firstName: customer.firstName,
                            lastName: customer.lastName,
                        },
                    });
                } else {
                    return of({});
                }
            }),
        ).subscribe(() => {
            this.registrationSent = true;
            this.changeDetector.markForCheck();
        });
    }
}
