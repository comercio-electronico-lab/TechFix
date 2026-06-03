export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderData {
  orderNumber: string;
  email: string;
  clientName: string;
  address: string;
  estimatedDate: string;
  courier: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
}

export const DEFAULT_ORDER: OrderData = {
  orderNumber: "#TF-9284-00129X",
  email: "j.carter@example.com",
  clientName: "Jameson Carter",
  address: "4821 Tech Boulevard, Suite 400\nSilicon Valley, CA 94025\nEstados Unidos",
  estimatedDate: "Jueves, 12 Dic",
  courier: "TechFix Express",
  items: [
    {
      id: '1',
      name: 'Pro-Series Ryzen Thermal Kit',
      description: 'Solución de Enfriamiento Grado Industrial',
      quantity: 1,
      price: 89.99,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC14gKNs7nGkDsKpwsDrNPklufxPNjMl5NMvl-aFi0GyA82T4TYTKuJtEfsX8WHldlKMR38M8fwWQPxTaoeOp1-Rgz0-asfa3JKJMO9ZTRhXauItUMi1soVqZRbJAn5pNkdADfzmN3IgW0cUcGyu3eJoz3T_0U75hRBvBeciWC9U_IRV-vRowFoQ6uSOpvzCWyXfrqqPtg-jybmS0keXw-QTx9pz8EXYnC5w2KxxkhwStf1uU_msqTy7FATRjQiKsWn7WZJBRikIIk'
    }
  ],
  subtotal: 89.99,
  shipping: 10.00,
  tax: 16.20
};

export const MOCK_ORDERS = [DEFAULT_ORDER];

export const getMockOrder = (index = 0): OrderData => {
  return MOCK_ORDERS[index] || DEFAULT_ORDER;
};
