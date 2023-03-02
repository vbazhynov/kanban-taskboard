import { DroppableProvided } from "@hello-pangea/dnd";

import { Card } from "../../../common/types";
import { DropZone } from "../styled/drop-zone";
import { Cards } from "./cards";

type Props = {
  dropProvided: DroppableProvided;
  cards: Card[];
  onCopyCard: Function;
  onDeleteCard: Function;
  onChangeTitle: Function;
};

const List = ({
  cards,
  dropProvided,
  onCopyCard,
  onDeleteCard,
  onChangeTitle,
}: Props) => {
  return (
    <div className="list-container">
      <DropZone ref={dropProvided.innerRef}>
        <Cards
          cards={cards}
          onCopyCard={onCopyCard}
          onDeleteCard={onDeleteCard}
          onChangeTitle={onChangeTitle}
        />
        {dropProvided.placeholder}
      </DropZone>
    </div>
  );
};

export { List };
