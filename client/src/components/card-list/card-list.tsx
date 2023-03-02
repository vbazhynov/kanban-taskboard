import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { CSSProperties } from "react";
import { CardEvent } from "../../common/enums";

import type { Card } from "../../common/types";
import { socket } from "../../context/socket";
import { List } from "./components/list";
import { ListWrapper } from "./styled/list-wrapper";
import { ScrollContainer } from "./styled/scroll-container";

type Props = {
  listId: string;
  listType: string;
  cards: Card[];
  style: CSSProperties;
};

const CardsList = ({ listId, listType, style, cards }: Props) => {
  const copyCardHandler = (cardId: string) => {
    socket.emit(CardEvent.COPY, listId, cardId);
  };

  const deleteCardHandler = (cardId: string) => {
    socket.emit(CardEvent.DELETE, listId, cardId);
  };

  const changeTitleHandler = (title: string, cardId: string) => {
    // console.log(`NewTitle - ${title} for card ${cardId} `);
    socket.emit(CardEvent.RENAME, title, listId, cardId);
  };

  return (
    <Droppable droppableId={listId} type={listType}>
      {(
        dropProvided: DroppableProvided,
        dropSnapshot: DroppableStateSnapshot
      ) => (
        <ListWrapper
          style={style}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          <ScrollContainer>
            <List
              cards={cards}
              dropProvided={dropProvided}
              onCopyCard={copyCardHandler}
              onDeleteCard={deleteCardHandler}
              onChangeTitle={changeTitleHandler}
            />
          </ScrollContainer>
        </ListWrapper>
      )}
    </Droppable>
  );
};

export { CardsList };
