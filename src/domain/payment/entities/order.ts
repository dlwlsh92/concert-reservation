export interface Order {
  id: number;
  userId: number;
  reservationId: number;
  totalPrice: number;
  orderDate: Date;
}
