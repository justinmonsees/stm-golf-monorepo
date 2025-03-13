"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

import uuid from "react-uuid";

const initialItems = [];
const storageKey = "cart";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  editItem: (id, item) => {},
  removeItem: (id) => {},
});

export function useCart() {
  return useContext(CartContext);
}

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    //create a copy of the items so we don't mutate the original items array currently stored
    const updatedItems = [...state.items];

    //create a unique id for the cart item
    const cartItemId = uuid();

    //add the item to the copy of items
    updatedItems.push({ id: cartItemId, ...action.item });

    return { ...state, items: updatedItems };
  }

  if (action.type === "EDIT_ITEM") {
    //first get the index of the item being edited
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    //create a copy of the state items array
    const updatedItems = [...state.items];

    //update the item in the items array copy
    updatedItems[existingCartItemIndex] = {
      id: updatedItems[existingCartItemIndex].id,
      ...action.item,
    };

    //update the actual state with the new array of items
    return { ...state, items: updatedItems };
  }

  if (action.type === "REMOVE_ITEM") {
    //first get the index of the item being removed
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
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
  const [cart, dispatchCartAction] = useReducer(
    cartReducer,
    initialItems,
    (initialItems) => {
      if (typeof window !== "undefined") {
        // Check for window
        const storedState = localStorage.getItem(storageKey);
        return { items: storedState ? JSON.parse(storedState) : initialItems };
      }
      return { items: initialItems }; // Default if no stored state or not in browser
    }
  );

  useEffect(() => {
    // This is a side-effect and belongs in an effect
    localStorage.setItem(storageKey, JSON.stringify(cart.items));
  }, [cart.items]);

  const addItem = (item) => {
    dispatchCartAction({ type: "ADD_ITEM", item });
  };

  const editItem = (id, item) => {
    dispatchCartAction({ type: "EDIT_ITEM", id, item });
  };

  const removeItem = (id) => {
    dispatchCartAction({ type: "REMOVE_ITEM", id });
  };

  const cartContext = {
    items: cart.items,
    addItem,
    editItem,
    removeItem,
  };
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}
