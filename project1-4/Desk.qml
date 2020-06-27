import QtQuick 2.2
import QtQuick.Controls 1.4

import "logic.js" as Logic

Rectangle {
    id: _desk
    property int gameAreaHeight: mainWindow.height
    property bool shuffleButtonVisible: false
    property bool shuffleButtonActive: false
    function startGame() {
        Logic.deleteSlots();
        return Logic.startGame();
    }

    function setButtonsEnabledState(newState) {
        menuButton.enabled = newState;
        shuffleButton.enabled = newState;
    }

    function cardReadyToAnchor(index, applyRuling) {
        if( Logic.cardReadyToAnchor(index, applyRuling) )
        {
            if( Logic.gameIsComplete() )
            {
                gameCompleteCongratulations.visible = true;
                gameCompleteCongratulations.isPlaying = true;
                setButtonsEnabledState(false);
            }
            return true;
        }
        return false;
    }

    function cardHasFacedownClickAction(index) {
        return Logic.facedownCardClickAction(index);
    }

    Component.onCompleted: {
        Logic.createDeck();
    }

    Image {
        id: background
        fillMode: Image.PreserveAspectCrop
        source: "background.jpg"
        anchors.fill: parent
        visible: true
    }



    Button {
        id: shuffleButton
        x: 250
        anchors.top: parent.top
        text: qsTr("Shuffle")
        visible: shuffleButtonVisible
        onClicked: {
            Logic.redeal();
        }

        style: DeactivableButtonStyle {
            active: shuffleButtonActive
        }
    }

    GameCompeleteBanner {
        id: gameCompleteCongratulations
        x: (mainWindow.width / 2) - (width / 2)
        y: (mainWindow.height / 2) - (height / 2)
        visible: false
        isPlaying: false
        z: parent.z + 1000
        MouseArea {
            anchors.centerIn: parent
            width: mainWindow.width
            height: mainWindow.height
            onClicked: {
                setButtonsEnabledState(true);
                gameCompleteCongratulations.visible = false;
            }
        }
    }
}
