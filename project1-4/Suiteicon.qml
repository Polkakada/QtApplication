import QtQuick 2.2

Item {
    id: __suiteIcon
    property string suite: "heart"
    property int number: 1
    width: 10
    height: 25
    Text {
        id: myNumber
        x: __suiteIcon.number == 10 ? 0 : 4
        text: __suiteIcon.number == 1 ? "A" :
                  __suiteIcon.number == 11 ? "J" :
                      __suiteIcon.number == 12 ? "Q" :
                          __suiteIcon.number == 13 ? "K" :
                              __suiteIcon.number
    }
    Heart {
        visible: __suiteIcon.suite == "heart" ? true : false
        anchors.top: myNumber.bottom
        anchors.horizontalCenter: myNumber.horizontalCenter
    }
    Diamond {
        visible: __suiteIcon.suite == "diamond" ? true : false
        anchors.top: myNumber.bottom
        anchors.horizontalCenter: myNumber.horizontalCenter
    }
    Spade {
        visible: __suiteIcon.suite == "spade" ? true : false
        anchors.top: myNumber.bottom
        anchors.horizontalCenter: myNumber.horizontalCenter
    }
    Clubs {
        visible: __suiteIcon.suite == "clubs" ? true : false
        anchors.top: myNumber.bottom
        anchors.horizontalCenter: myNumber.horizontalCenter
    }
}
