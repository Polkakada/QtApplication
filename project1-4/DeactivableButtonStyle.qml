import QtQuick 2.2
import QtQuick.Controls.Styles 1.4

ButtonStyle {
    id: _rootStyle
    property bool active: true
    background: Rectangle {
        property bool active: _rootStyle.active
        id: backgroundRectangle
        border.width: 1
        border.color: "#888888"
        color: "#888888"
        radius: 4
        onActiveChanged: {
            if( active )
            {
                color = "#DDDDDD"
            }
            else
            {
                color = "#888888"
            }
        }
    }
}
