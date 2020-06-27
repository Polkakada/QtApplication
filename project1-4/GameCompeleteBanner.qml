import QtQuick 2.7


Rectangle {
    id: _banner
    property bool isPlaying: false
    width: clapImage.width + 20
    height: clapImage.height + 20
    color: "white"
    AnimatedImage {
        id: clapImage
        source: "slow_clap_citizen_kane.gif"
        playing: _banner.isPlaying
        paused: !_banner.isPlaying
        anchors.centerIn: parent
        Text {
            id: wonText
            anchors.centerIn: parent
            color: "white"
            font.pointSize: 20
            text: qsTr("Congratulations, you won!")
        }
    }
}
