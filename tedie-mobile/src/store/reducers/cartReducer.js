const initialValues = {
  products: [],
  companySelectId: {},
  markets: [],
  horário: null,
  address: null,
  card: null,
  quantity: 0,
};

export default function cartReducer(state = initialValues, action) {
  let newProducts = [];
  let existCompany = false;
  let markets = [];
  switch (action.type) {
    case 'ADD_PRODUCT':
      newProducts = [...state.products, { product: action.product, quantity: 1 }];
      existCompany = state.markets.find((market) => market.id === action.idCompany);
      if (!existCompany) {
        markets = [...state.markets, { id: action.idCompany, quantity: 0 }];
        return Object.assign(state, {
          products: newProducts,
          quantity: state.quantity + 1,
          markets,
        });
      }
      markets = state.markets.map((market) => {
        if (market.id === action.idCompany) {
          return { ...market, quantity: market.quantity + 1 };
        }
      });

      return Object.assign(state, {
        products: newProducts,
        quantity: state.quantity + 1,
        markets,
      });
    case 'REMOVE_PRODUCT':
      newProducts = state.products.filter((product) => product.product.Id !== action.id);

      existCompany = state.markets.filter((market) => market.id === action.idCompany);
      if (existCompany.length === 1) {
        markets = state.markets.filter((market) => market !== action.idCompany);
        return Object.assign(state, {
          products: newProducts,
          quantity: state.quantity - 1,
          markets,
        });
      }

      markets = state.markets.map((market) => {
        if (market.id === action.idCompany) {
          return { ...market, quantity: market.quantity - 1 };
        }
      });

      return Object.assign(state, {
        products: newProducts,
        quantity: state.quantity - 1,
        markets,
      });

    case 'REMOVE_PRODUCT_QUANTITY':
      newProducts = state.products.map((product) => {
        if (product.product.Id === action.id) {
          return Object.assign(product, {
            quantity: product.quantity - 1,
          });
        }
        return product;
      });
      markets = state.markets.map((market) => {
        if (market.id === action.idCompany) {
          return { ...market, quantity: market.quantity - 1 };
        }
      });
      return Object.assign(state, {
        products: newProducts,
        quantity: state.quantity - 1,
        markets,
      });

    case 'ADD_PRODUCT_QUANTITY':
      newProducts = state.products.map((product) => {
        if (product.product.Id === action.id) {
          const newProduct = Object.assign(product, {
            quantity: product.quantity + 1,
          });
          return newProduct;
        }
        return product;
      });

      markets = state.markets.map((market) => {
        if (market.id === action.idCompany) {
          return { ...market, quantity: market.quantity + 1 };
        }
      });

      return Object.assign(state, {
        products: newProducts,
        quantity: state.quantity + 1,
        markets,
      });
    case 'ADD_SELECT_COMPANY':
      return Object.assign(state, {
        companySelectId: { id: action.id, name: action.name },
      });
    default:
      return state;
  }
}
