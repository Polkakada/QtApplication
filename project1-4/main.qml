import QtQuick 2.2
import QtQuick.Window 2.2
import QtQuick.Controls 1.4


Window {
    id: mainWindow
    visible:true
    width: 800
    height: 480
    Flickable {
        id: mainArea
        anchors.fill: parent
        contentWidth: parent.width
        contentHeight: mainObject.gameAreaHeight
        property int menuButtonWidth: menuButton.width

        StackView {
            id: stack
            anchors.fill: parent
            initialItem: mainObject
            Component.onCompleted: {
                stack.push(background)
                mainMenu.newGameAvailable = false;
            }
            Desk {
                id: mainObject

            }


           Image {
                id: background
                fillMode: Image.PreserveAspectCrop
                source: "background.jpg"
                anchors.fill: parent
                visible: true

                Text{
                    id:men
                    text: "START"
                    font.pixelSize: 40
                    anchors.top: parent.top
                    anchors.topMargin: 300
                    anchors.horizontalCenter: parent.horizontalCenter
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            if(mainObject.startGame())
                            {
                                mainMenu.newGameAvailable = true;
                                stack.pop();
                            }
                        }
                    }

                }
            }
        }

        Button {
            id: menuButton
            anchors.right: parent.right
            anchors.top: parent.top
            text: qsTr("Menu")
            onClicked: {
                mainMenu.popup();
            }
            style: DeactivableButtonStyle {}
        }

        GameMenu {
            id: mainMenu
            onStartNewGame: {
                stack.push(background);
            }

        }
    }
}

