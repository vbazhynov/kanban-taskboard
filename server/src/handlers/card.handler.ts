import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.COPY, this.copyCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(
      CardEvent.CHANGE_DESCRIPTION,
      this.changeCardDescription.bind(this)
    );
  }

  public createCard(listId: string, cardName: string): void {
    // console.log(`operation - CREATE, listId ${listId}, cardName ${cardName}`);

    const newCard = new Card(cardName, "");
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);

    if (!list) return;

    const updatedList = { ...list, cards: list.cards.concat(newCard) };
    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list))
    );
    this.updateLists();
  }

  public deleteCard(listId: string, cardId: string): void {
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);

    if (!list) return;

    const index = list.cards.findIndex((card) => card.id === cardId);
    const newCards = [...list.cards];
    newCards.splice(index, 1);
    const updatedList = {
      ...list,
      cards: newCards,
    };
    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list))
    );
    this.updateLists();
  }

  public copyCard(listId: string, cardId: string): void {
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);

    if (!list) return;

    const card = list.cards.find((card) => card.id === cardId);
    const index = list.cards.findIndex((card) => card.id === cardId);
    const newCard = card.clone(); // PATTERN:{Prototype}
    const newCards = [...list.cards];
    newCards.splice(index + 1, 0, newCard);

    const updatedList = {
      ...list,
      cards: newCards,
    };

    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list))
    );
    this.updateLists();
  }

  public renameCard(newTitle: string, listId: string, cardId: string): void {
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);

    if (!list) return;

    const card = list.cards.find((card) => card.id === cardId);
    card.name = newTitle;

    const index = list.cards.findIndex((card) => card.id === cardId);
    const newCards = [...list.cards];
    newCards.splice(index, 1, card);

    const updatedList = {
      ...list,
      cards: newCards,
    };

    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list))
    );
    this.updateLists();
  }

  public changeCardDescription(
    cardText: string,
    listId: string,
    cardId: string
  ): void {
    console.log();
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);

    if (!list) return;

    const card = list.cards.find((card) => card.id === cardId);
    card.description = cardText;

    const index = list.cards.findIndex((card) => card.id === cardId);
    const newCards = [...list.cards];
    newCards.splice(index, 1, card);

    const updatedList = {
      ...list,
      cards: newCards,
    };

    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list))
    );
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }
}
