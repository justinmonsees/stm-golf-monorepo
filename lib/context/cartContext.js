"use client";

import { createContext, useContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  reduceItemQty: (id) => {},
  removeItem: (id) => {},
});

export function useCart() {
  return useContext(CartContext);
}

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    //first check to see if the item already exists in the items array
    // if it does, return the index of the item so that the quantity can be updated
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.item_id === action.item.item_id
    );

    //create a copy of the items so we don't mutate the original items array currently stored
    const updatedItems = [...state.items];

    //if the item does exist already in the cart, just update the quantity
    if (existingCartItemIndex > -1) {
      const updatedItem = {
        ...state.items[existingCartItemIndex],
        quantity: state.items[existingCartItemIndex].quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === "REDUCE_ITEM_QTY") {
    //first get the index of the item being removed
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.item_id === action.item_id
    );

    //create a copy of the state items array
    const updatedItems = [...state.items];

    //create a copy of the item to update
    const itemToUpdate = {
      ...state.items[existingCartItemIndex],
    };

    //if the item quantity is only one remove it from the items array
    if (itemToUpdate.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    }
    //otherwise just subract one from the quantity
    else {
      itemToUpdate.quantity = itemToUpdate.quantity - 1;
      updatedItems[existingCartItemIndex] = itemToUpdate;
    }

    //update the actual state with the new array of items
    return { ...state, items: updatedItems };
  }

  if (action.type === "REMOVE_ITEM") {
    //first get the index of the item being removed
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.item_id === action.item_id
    );

    //create a copy of the state items array
    const updatedItems = [...state.items];

    //remove the item from the updatedItems array
    updatedItems.splice(existingCartItemIndex, 1);

    //update the actual state with the new array of items
    return { ...state, items: updatedItems };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  const addItem = (item) => {
    dispatchCartAction({ type: "ADD_ITEM", item });
  };

  const reduceItemQty = (item_id) => {
    dispatchCartAction({ type: "REDUCE_ITEM_QTY", item_id });
  };

  const removeItem = (item_id) => {
    dispatchCartAction({ type: "REMOVE_ITEM", item_id });
  };

  const cartContext = {
    items: cart.items,
    addItem,
    reduceItemQty,
    removeItem,
  };
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}
