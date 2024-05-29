class PaymentInfoRequest {
    amount: number;
    currency: string;
    receiptEmail: string | undefined;

    constructor(amount: number, currency: string, freceiptEmail: string | undefined) {
        this.amount = amount;
        this.currency = currency;
        this.receiptEmail = this.receiptEmail;
    }
}

export default PaymentInfoRequest;