var deck = new Array(52);
var cardSlots = new Array(13);
var slotCount = 0;
var firstRowY = 5;
var firstGameAreaRowY = 150;
var firstColumnX = 30;
var deltaX = 110; // card width (80) + card separator (30).
var deltaY = 150; // card height (120) + card separator (30).
var allowedCardOffsetX = 54; // half of card width (80/2) + half of (deltaX - cardwidth) ((110-80)/2) - 1.
var allowedCardOffsetY = 74; // half of card height (120/2) + half of card separator (30/2) - 1.
var cardsToBypassWhenDealing = 0;

function startGame() { // старт игры

    resetDeck();
    mainObject.shuffleButtonActive = false;
    mainObject.shuffleButtonVisible = true;
    shuffleDeck();
    createSlotsForGame();
    dealGame();
    mainObject.gameAreaHeight = 700;
    return true;

}

function redeal() // перемешать
{

    if(mainObject.shuffleButtonActive){
    reDealGame();
    }


}

function reDealGame() // дополнительный слот с картами
{
    // Возьмите карты из слота 12 и сложите их лицом вниз в слот 11 в обратном порядке.
    var source = cardSlots[12];
    while (source.aboveMe)
        source = source.aboveMe;
    // карта привязки в обратном порядке, лицом вниз.
    var cardToPlace = source;
    var target = cardSlots[11];
    while (cardToPlace.belowMe) {
        source = cardToPlace.belowMe;
        detachCard(cardToPlace);
        cardToPlace.faceDown = true;
        if (target.belowMe) {
            anchorCardOverOther(cardToPlace, target, false);
        } else {
            anchorCardOverSlot(cardToPlace, target, false);
        }
        target = cardToPlace;
        cardToPlace = source;
    }
    mainObject.shuffleButtonActive = false;
}



function detachCard(cardToDetach)//отсоединить карту
{
    if( cardToDetach.aboveMe )
    {
        cardToDetach.aboveMe.belowMe = cardToDetach.belowMe;
    }
    if( cardToDetach.belowMe )
    {
        cardToDetach.belowMe.aboveMe = cardToDetach.aboveMe;
    }
    resetCard(cardToDetach);
    return cardToDetach;
}

function indexOfSixWithinTopTenCards()
{
    for( var index = 51 ; index > 41 ; index-- )
    {
        if( 6 === deck[index].myNumber )
        {
            return index;
        }
    }
    return -1;
}





function dealGame() { // расставить  всю доску
    var index = 0;
    for( var start = 0; start < 7; start++ )
    {
        for( var column = start; column < 7; column++ )
        {
            if( start == column )
            {
                deck[index].faceDown = false;
            }
            if( start > 0 )
            {
                anchorCardOverOther(deck[index], deck[index-(7-start)], false);
            }
            else
            {
                anchorCardOverSlot(deck[index], cardSlots[column], false);
            }
            index++;
        }
    }
    // rest of the deck to start pile.
    anchorCardOverSlot(deck[index], cardSlots[11], false);
    index++;
    while (index < 52) {
        anchorCardOverOther(deck[index], deck[index-1], false);
        deck[index].anchors.verticalCenterOffset = 0
        index++;
    }
}

function gameIsComplete() { // завершена ли игры

        if( cardSlots[0].aboveMe ||
            cardSlots[1].aboveMe ||
            cardSlots[2].aboveMe ||
            cardSlots[3].aboveMe ||
            cardSlots[4].aboveMe ||
            cardSlots[5].aboveMe ||
            cardSlots[6].aboveMe ||
            cardSlots[11].aboveMe ||
            cardSlots[12].aboveMe )
            return false;
        else
            return true;

}

function createDeck() { // сбор доски
    var component = Qt.createComponent("Card.qml");
    if (component.status === Component.Ready)
    {
        for( var suite = 0 ; suite < 4 ; suite++ ) {
            for( var number = 0 ; number < 13 ; number++ ) {
                createCard(component, suite, number);
            }
        }
        resetDeck();
    }
    else if (component.status === Component.Error) {
        console.log("Error: ");
        console.log(component.errorString() );
    }
}

function createCard(component, suite, number) // создать карту
{
    var suiteText = "spade"
    switch( suite )
    {
    case 0:
        suiteText = "diamond";
        break;
    case 1:
        suiteText = "clubs";
        break;
    case 2:
        suiteText = "heart";
        break;
    default:
        break;
    }

    var newObject = component.createObject(mainObject);
    newObject.myNumber = number+1;
    newObject.mySuite = suiteText;
    newObject.myId = toIndex(suite,number);
    deck[newObject.myId] = newObject;
}

function resetCard(cardToReset) // обнулить карту
{
    cardToReset.aboveMe = null;
    cardToReset.belowMe = null;
    cardToReset.anchors.centerIn = null;
    cardToReset.x = firstColumnX;
    cardToReset.y = firstRowY;
    cardToReset.z = 10+cardToReset.myId;
    cardToReset.faceDown = true;
}

function resetDeck()// обнулить доску
{

    for( var index = 0 ; index < 52 ; index++ ) {
        resetCard(deck[index]);
    }
}

function shuffleDeck() // перемешать доску
{
    for( var index = 0 ; index < 52 ; index++ ) {
        var cardToMove = deck[index];
        var newIndex = Math.floor(Math.random()*52);
        deck[index] = deck[newIndex];
        deck[newIndex] = cardToMove;
    }
    for( var index = 0 ; index < 52 ; index++ ) {
        deck[index].z = 10+index;
        deck[index].myId = index;
    }
}

function deleteSlots()// удаление слотов
{
    for( var index = 0 ; index < slotCount ; index++ )
    {
        cardSlots[index].destroy();
        cardSlots[index] = null;
    }
    slotCount = 0;
}

function createSlots(count)//создание слотов под карты
{
    var component = Qt.createComponent("CardSlot.qml");
    if (component.status === Component.Ready)
    {
        for( var index = 0 ; index < count ; index++ ) {
            cardSlots[index] = component.createObject(mainObject);
        }
        slotCount = count;
    }
    else if (component.status === Component.Error) {
        console.log("Error: ");
        console.log(component.errorString() );
    }
}





function createSlotsForGame()// создание слотов на игру
{
    createSlots(13);
    if( slotCount === 13 )
    {
        for( var index = 0 ; index < 7 ; index++ ) {
            cardSlots[index].x = firstColumnX + (index * deltaX);
            cardSlots[index].y = firstGameAreaRowY;
            cardSlots[index].z = 1;
        }
        for( index = 0 ; index < 4 ; index++ ) {
            cardSlots[index+7].x = firstColumnX + ((index+3) * deltaX);
            cardSlots[index+7].y = firstRowY;
            cardSlots[index+7].z = 1;
            cardSlots[index+7].acceptsOnlySpecificNumber = true;
            cardSlots[index+7].acceptedNumber = 1;
            cardSlots[index+7].faceUpVerticalOffset = 0;
        }
        for( index = 0 ; index < 2 ; index++ ) {
            cardSlots[index+11].x = firstColumnX + (index * deltaX);
            cardSlots[index+11].y = firstRowY;
            cardSlots[index+11].z = 1;
            cardSlots[index+11].faceUpVerticalOffset = 0;
            cardSlots[index+11].faceDownVerticalOffset = 0;
        }
    }
}

function toIndex(suite, number)
{
    return number + (suite*13);
}

function rulesAllowCardOverSlot(cardInQuestion, slotToUse)//правила карта перед слотом
{
    if( slotToUse.acceptsOnlySpecificNumber &&
        (cardInQuestion.myNumber !== slotToUse.acceptedNumber) )
        return false; // None of the rules allow this.


        // Player cannot place a card over pile slots.
        if( (slotToUse === cardSlots[11]) ||
            (slotToUse === cardSlots[12]) )
            return false;
        // Aceslot only accepts ace that is not part of a pile.
        if( slotToUse.acceptsOnlySpecificNumber )
        {
            // card already matches to slot or we wouldn't be here
            if( cardInQuestion.aboveMe === null )
                return true;
            else
                return false;
        }
        // allows any card over empty slot when it's not ace slot
        return true;

}

function anchorCardOverSlot(cardToAnchor, slotToUse, applyRuling)// привязка катры за слотом
{
    if( (slotToUse.aboveMe === null) )
    {
        if( !applyRuling ||
            rulesAllowCardOverSlot(cardToAnchor, slotToUse) )
        {
            slotToUse.aboveMe = cardToAnchor;
            cardToAnchor.belowMe = slotToUse;
            cardToAnchor.anchors.centerIn = slotToUse;
            cardToAnchor.anchors.verticalCenterOffset = 0;
            cardToAnchor.z = Qt.binding(function() {return slotToUse.z+1});
            return true;
        }
    }
    return false;
}

function getSlotBelowCard(cardObject)// взять слот за картой
{
    var slot = cardObject.belowMe;
    while( slot &&
           (slot.belowMe !== undefined) &&
           (slot.belowMe !== null) )
    {
        slot = slot.belowMe;
    }
    return slot;
}

function cardIsOverAceSlot(cardObject)// карта на Асе слоте?
{
    var slot = getSlotBelowCard(cardObject);
    if( slot &&
        slot.acceptsOnlySpecificNumber  &&
        (1 === slot.acceptedNumber) )
        return true;
    else
        return false;
}

function cardIsRed(cardToCheck)//красная ли карта
{
    if ((cardToCheck.mySuite === "heart") ||
        (cardToCheck.mySuite === "diamond"))
        return true;
    else
        return false;
}

function cardsAreBlackAndRed(cardBelow, cardOnTop)// белая или красная карта
{
    if ( cardIsRed(cardBelow) &&
        !cardIsRed(cardOnTop) )
            return true;
    if(!cardIsRed(cardBelow) &&
        cardIsRed(cardOnTop) )
            return true;
    return false;
}

function rulesAllowCardOverOther(cardOnTop, cardBelow)// карта за другими картами
{
    var slot = getSlotBelowCard(cardBelow);

        // Never OK to be over face down card
        if( cardBelow.faceDown )
            return false;
        // Cannot be placed to either pile.
        if ( (cardSlots[11] === slot) ||
             (cardSlots[12] === slot) )
            return false;
        // Ace slot
        if( slot.acceptsOnlySpecificNumber )
        {
            // Card needs to be of same suite and one larger than the one below
            if( (cardBelow.mySuite === cardOnTop.mySuite) &&
                ((cardBelow.myNumber+1) === cardOnTop.myNumber) )
            {
                // Card needs to be alone
                if( cardOnTop.aboveMe === null )
                    return true;
            }
            return false;
        }
        // Elsewhere card needs to be of suite of opposite color and one smaller than the one below
        if( (cardBelow.myNumber === (cardOnTop.myNumber+1)) &&
            cardsAreBlackAndRed(cardBelow, cardOnTop) )
        {
            return true;
        }
        else
        {
            return false;
        }


}

function getVerticalOffsetForCard(cardObject) // взятие отступа
{
    var slot = getSlotBelowCard(cardObject);
    if (cardObject.faceDown)
        return slot.faceDownVerticalOffset;
    else
        return slot.faceUpVerticalOffset;
}

function anchorCardOverOther(cardOnTop, cardBelow, applyRuling)// привязка карты
{
    if(cardBelow !== undefined)
    {
        if( (cardOnTop !== cardBelow) &&
            (cardBelow.aboveMe === null) )
        {
            if( !applyRuling ||
                rulesAllowCardOverOther(cardOnTop, cardBelow) )
            {
                cardOnTop.anchors.centerIn = cardBelow;
                cardOnTop.anchors.verticalCenterOffset = getVerticalOffsetForCard(cardBelow);
                cardOnTop.z = Qt.binding(function() {return cardBelow.z+1});
                cardBelow.aboveMe = cardOnTop;
                cardOnTop.belowMe = cardBelow;
                return true;
            }
        }
    }
    return false;
}

function cardReadyToAnchor(cardIndex, applyRuling)// готова ли карта к привязке
{
    if( !(52 > cardIndex) )
    {
        console.log("Invalid card index ", cardIndex, " tried to be attached, aborting...");
        return false;
    }

    var cardToAnchor = deck[cardIndex];
    var selectedCard;
    var isSlot = false;
    for( var slotLoopIndex = 0 ; slotLoopIndex < slotCount ; slotLoopIndex++ )
    {
        // First try card slots
        var compareSlot = cardSlots[slotLoopIndex];
        if( ((compareSlot.x-allowedCardOffsetX) <= cardToAnchor.x) &&
             (cardToAnchor.x <= (compareSlot.x + allowedCardOffsetX)) &&
            ((compareSlot.y-allowedCardOffsetY) <= cardToAnchor.y) &&
             (cardToAnchor.y <= (compareSlot.y + allowedCardOffsetY)) )
        {
            selectedCard = compareSlot;
            isSlot = true;
        }
    }

    for( var cardLoopIndex = 0 ; cardLoopIndex < 52 ; cardLoopIndex++ )
    {
        var compareCard = deck[cardLoopIndex];
        // Check for same card anchoring to avoid loop reference
        if( (compareCard.z < cardToAnchor.z) &&
            ((compareCard.x-allowedCardOffsetX) <= cardToAnchor.x) &&
            (cardToAnchor.x <= (compareCard.x + allowedCardOffsetX)) &&
            ((compareCard.y-allowedCardOffsetY) <= cardToAnchor.y) &&
            (cardToAnchor.y <= (compareCard.y + allowedCardOffsetY)) )
        {
            if( selectedCard === undefined )
            {
                selectedCard = compareCard;
            }
            else
            {
                if( isSlot ||
                    (compareCard.z > selectedCard.z) )
                {
                    selectedCard = compareCard;
                }
            }
            isSlot = false;
        }
    }
    var returnValue;
    if( isSlot )
    {
        returnValue = anchorCardOverSlot(cardToAnchor, selectedCard, applyRuling);
    }
    else
    {
        returnValue = anchorCardOverOther(cardToAnchor, selectedCard, applyRuling);
    }
    if( false === returnValue )
    {
        // Anchoring failed, make sure card is left without connections.
        if( cardToAnchor.belowMe )
        {
            cardToAnchor.belowMe.aboveMe = null;
            cardToAnchor.belowMe = null;
        }
        cardToAnchor.anchors.centerIn = null;
    }
    return returnValue;
}

function facedownCardClickAction(cardIndex)// нажатие на карту лежащую спиной вверх
{
    if (52 > cardIndex) {
        var cardForAction = deck[cardIndex];
        var slot = getSlotBelowCard(cardForAction);

            if (cardSlots[11] === slot) {
                // Take third card from the top
                var cardToDetach = cardForAction;
                for (var loop = 0; loop < 2; loop++) {
                    if (cardToDetach.belowMe.belowMe)
                        cardToDetach = cardToDetach.belowMe;
                }
                // Detach card(s) from pile
                cardToDetach.belowMe.aboveMe = null;
                cardToDetach.belowMe = null;
                cardToDetach.anchors.centerIn = null;
                // find top card of turnover pile (or slot itself)
                var target = cardSlots[12];
                while (target.aboveMe)
                    target = target.aboveMe;
                // anchor card(s) in reverse order, face up.
                while (cardForAction) {
                    cardToDetach = cardForAction;
                    cardForAction = cardToDetach.belowMe;
                    detachCard(cardToDetach);
                    cardToDetach.faceDown = false;
                    if (target.belowMe) {
                        anchorCardOverOther(cardToDetach, target, false);
                    } else {
                        anchorCardOverSlot(cardToDetach, target, false);
                    }
                    target = cardToDetach;
                }
                if( null === cardSlots[11].aboveMe )
                    mainObject.shuffleButtonActive = true;
                return true;

        }       
    } else {
        console.log("Invalid card index ", cardIndex, " tried to perform card click action, aborting...");
    }
    return false;
}
