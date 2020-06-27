import QtQuick 2.2
import QtQuick.Controls 1.4


Menu {
    id: _rootMenu
    property bool newGameAvailable: false
    signal startNewGame()
    signal languageChanged(string language)
    title: qsTr("Menu")
    MenuItem {
        text: qsTr("Start New Game")
        enabled: _rootMenu.newGameAvailable
        onTriggered: _rootMenu.startNewGame()
    }

}
