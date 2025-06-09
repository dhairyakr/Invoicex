// Google Pay API Type Definitions
declare namespace google {
  namespace payments {
    namespace api {
      interface PaymentsClient {
        isReadyToPay(request: IsReadyToPayRequest): Promise<IsReadyToPayResponse>;
        loadPaymentData(request: PaymentDataRequest): Promise<PaymentData>;
        createButton(options: ButtonOptions): HTMLElement;
        prefetchPaymentData(request: PaymentDataRequest): void;
      }

      interface IsReadyToPayRequest {
        apiVersion: number;
        apiVersionMinor: number;
        allowedPaymentMethods: PaymentMethod[];
        existingPaymentMethodRequired?: boolean;
      }

      interface IsReadyToPayResponse {
        result: boolean;
        paymentMethodPresent?: boolean;
      }

      interface PaymentDataRequest {
        apiVersion: number;
        apiVersionMinor: number;
        allowedPaymentMethods: PaymentMethod[];
        merchantInfo: MerchantInfo;
        transactionInfo: TransactionInfo;
        emailRequired?: boolean;
        shippingAddressRequired?: boolean;
        shippingAddressParameters?: ShippingAddressParameters;
        callbackIntents?: string[];
      }

      interface PaymentMethod {
        type: string;
        parameters: any;
        tokenizationSpecification?: TokenizationSpecification;
      }

      interface TokenizationSpecification {
        type: string;
        parameters: any;
      }

      interface MerchantInfo {
        merchantId?: string;
        merchantName: string;
      }

      interface TransactionInfo {
        totalPriceStatus: string;
        totalPriceLabel?: string;
        totalPrice: string;
        currencyCode: string;
        countryCode?: string;
        transactionId?: string;
        displayItems?: DisplayItem[];
      }

      interface DisplayItem {
        label: string;
        type: string;
        price: string;
      }

      interface ShippingAddressParameters {
        allowedCountryCodes?: string[];
        phoneNumberRequired?: boolean;
      }

      interface PaymentData {
        apiVersion: number;
        apiVersionMinor: number;
        paymentMethodData: PaymentMethodData;
        email?: string;
        shippingAddress?: Address;
      }

      interface PaymentMethodData {
        type: string;
        description: string;
        info: any;
        tokenizationData: TokenizationData;
      }

      interface TokenizationData {
        type: string;
        token: string;
      }

      interface Address {
        name: string;
        address1: string;
        address2?: string;
        address3?: string;
        locality: string;
        administrativeArea: string;
        countryCode: string;
        postalCode: string;
        phoneNumber?: string;
      }

      interface ButtonOptions {
        onClick: () => void;
        allowedPaymentMethods: PaymentMethod[];
        buttonColor?: 'default' | 'black' | 'white';
        buttonType?: 'book' | 'buy' | 'checkout' | 'donate' | 'order' | 'pay' | 'plain' | 'subscribe';
        buttonSizeMode?: 'static' | 'fill';
        buttonLocale?: string;
      }

      interface PaymentsClientOptions {
        environment: 'TEST' | 'PRODUCTION';
        merchantInfo?: MerchantInfo;
        paymentDataCallbacks?: PaymentDataCallbacks;
      }

      interface PaymentDataCallbacks {
        onPaymentAuthorized?: (paymentData: PaymentData) => PaymentAuthorizationResult | Promise<PaymentAuthorizationResult>;
        onPaymentDataChanged?: (intermediatePaymentData: IntermediatePaymentData) => PaymentDataRequestUpdate | Promise<PaymentDataRequestUpdate>;
      }

      interface PaymentAuthorizationResult {
        transactionState: 'SUCCESS' | 'ERROR';
        error?: PaymentError;
      }

      interface PaymentError {
        reason: string;
        message: string;
        intent: string;
      }

      interface IntermediatePaymentData {
        callbackTrigger: string;
        paymentMethodData?: PaymentMethodData;
        shippingAddress?: Address;
        shippingOptionData?: ShippingOptionData;
      }

      interface ShippingOptionData {
        id: string;
      }

      interface PaymentDataRequestUpdate {
        error?: PaymentError;
        newShippingOptionParameters?: ShippingOptionParameters;
        newTransactionInfo?: TransactionInfo;
      }

      interface ShippingOptionParameters {
        defaultSelectedOptionId?: string;
        shippingOptions: ShippingOption[];
      }

      interface ShippingOption {
        id: string;
        label: string;
        description: string;
      }

      // Constructor
      const PaymentsClient: {
        new (options: PaymentsClientOptions): PaymentsClient;
      };
    }
  }
}