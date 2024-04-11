export const IOrderRepositoryToken = Symbol("IOrderRepository");

// 임시 조치로 여기 만들어 두었습니다....
export interface Order {
  id: number;
  userId: number;
  reservationId: number;
  totalPrice: number;
  orderDate: Date;
}

export interface IOrder {
  createOrder(
    userId: number,
    reservationId: number,
    totalPrice: number
  ): Promise<Order>;
}
