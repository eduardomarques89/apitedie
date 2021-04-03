import { createContext } from 'react';

export const CartContext = createContext();

export const cartInitialState = {
  selected: undefined,
  selectedNome: undefined,
  totalCompras: 0,
  total: 0,
  markets: [],
  products: [],
  totalComprasPorEstabelecimento: [],
  selectMarket: {},
};

export const appCartReducer = (state = cartInitialState, action) => {
  let existProduct;
  let newProducts;
  let existMarket;
  let newMarkets;
  let newTotal;
  switch (action.type) {
    case 'select':
      return { ...state, selected: action.payload };
    case 'CLEAR_CART':
      return { ...cartInitialState };
    case 'ADD_MARKET_TAX':
      newMarkets = state.markets.map((market) => {
        if (market.market.IdEmpresa === action.payload.id) {
          return { ...market, tax: Number(action.payload.tax) };
        }
        return market;
      });
      return { ...state, markets: newMarkets };
    case 'Add_MARKET':
      existMarket = state.markets.find((market) => market.market.IdEmpresa === action.payload.market.IdEmpresa);
      if (existMarket) {
        return state;
      }
      return {
        ...state,
        markets: [...state.markets, {
          market: action.payload.market, quantity: 0, total: 0, tax: 0,
        }],
      };
    case 'LOAD_MARKET_DATA':
      return action.payload;
    case 'REMOVE_PRODUCT':
      existProduct = state.products.find((product) => product.product.Id === action.payload.product.Id);

      if (existProduct) {
        if (existProduct.quantity == 1 || existProduct.quantity - action.payload.quantity <= 0) {
          newProducts = state.products.filter((product) => product.product.Id !== existProduct.product.Id);
        } else {
          newProducts = state.products.map((product) => {
            if (product.product.Id === action.payload.product.Id) {
              return { ...product, quantity: (product.quantity || 0) - action.payload.quantity };
            }
            return product;
          });
        }
      } else {
        newProducts = [...state.products, { product: action.payload.product, quantity: action.payload.quantity }];
      }

      existMarket = state.markets.find((market) => market.market.IdEmpresa === existProduct.product.IdEmpresa);
      if (existMarket.quantity - action.payload.quantity <= 0) {
        newMarkets = state.markets.filter((market) => market.market.IdEmpresa !== existMarket.market.IdEmpresa);
      } else {
        newMarkets = state.markets.map((market) => {
          if (market.market.IdEmpresa === action.payload.product.IdEmpresa) {
            const newMarket = market;
            newMarket.quantity -= action.payload.quantity;
            newMarket.total -= action.payload.quantity * (action.payload.product.Preco_Por || action.payload.product.Preco_De);
            return newMarket;
          }
          return market;
        });
      }

      newTotal = newMarkets.reduce((marketPrev, marketCurrent) => marketPrev + marketCurrent.total, 0);
      return {
        ...state, products: newProducts, markets: newMarkets, total: newTotal,
      };

    case 'ADD_PRODUCT':
      existProduct = state.products.find((product) => product.product.Id === action.payload.product.Id);
      if (existProduct) {
        newProducts = state.products.map((product) => {
          if (product.product.Id === action.payload.product.Id) {
            return { ...product, quantity: (product.quantity || 0) + action.payload.quantity };
          }
          return product;
        });
      } else {
        newProducts = [...state.products, { product: action.payload.product, quantity: action.payload.quantity }];
      }

      newMarkets = state.markets.map((market) => {
        if (market.market.IdEmpresa === action.payload.product.IdEmpresa) {
          const newMarket = market;
          newMarket.quantity += action.payload.quantity;
          newMarket.total += action.payload.quantity * (action.payload.product.Preco_Por || action.payload.product.Preco_De);
          return newMarket;
        }
        return market;
      });
      newTotal = newMarkets.reduce((marketPrev, marketCurrent) => marketPrev + marketCurrent.total, 0);
      return {
        ...state, products: newProducts, markets: newMarkets, total: newTotal,
      };
    default:
      return state;
  }
};
