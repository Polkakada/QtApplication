import QtQuick 2.0

Rectangle {
    id: cardPlaceHolder
    width: 80
    height: 120
    border.width: 4
    color: "transparent"
    property bool acceptsOnlySpecificNumber: false
    property int acceptedNumber: 1
    property int faceDownVerticalOffset: 5
    property int faceUpVerticalOffset: 30
    property Item aboveMe: null
    Text {
        id: aceMarker
        anchors.centerIn: parent
        visible: cardPlaceHolder.acceptsOnlySpecificNumber
        text: "A"
        color: "#808080"
        font.pixelSize: 80
    }
    onAcceptedNumberChanged: {
        if( (acceptedNumber > 1) &&
            (acceptedNumber < 11) )
            aceMarker.text = acceptedNumber;
        else if (acceptedNumber === 1)
            aceMarker.text = "A";
        else if (acceptedNumber === 11)
            aceMarker.text = "J";
        else if (acceptedNumber === 12)
            aceMarker.text = "Q";
        else if (acceptedNumber === 13)
            aceMarker.text = "K";
        else
            aceMarker.text = ""
    }
}

