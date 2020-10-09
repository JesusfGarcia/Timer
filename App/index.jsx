import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Picker,
  Platform,
  Vibration,
} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderWidth: 10,
    borderColor: "#fff",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 45,
    color: "#fff",
  },
  buttonStop: {
    borderColor: "#ff0000",
  },
  buttonTextStop: {
    color: "#ff0000",
  },
  countText: {
    fontSize: 80,
    color: "#fff",
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
        marginLeft: 10,
      },
    }),
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

export default function App() {
  const [remainingSeconds, setRemainingSeconds] = React.useState(0);
  const [selectedMinutes, setSelectedMinutes] = React.useState(0);
  const [selectedSeconds, setSelectedSeconds] = React.useState(0);
  const [isOn, setIsOn] = React.useState(false);
  const { minutes, seconds } = getRemaining(remainingSeconds);

  //vibración
  const ONE_SECOND_IN_MS = 1000;

  const start = () => {
    setRemainingSeconds(
      parseInt(selectedMinutes, 10) * 60 + parseInt(selectedSeconds, 10)
    );
    setIsOn(!isOn);
  };

  const finish = () => {
    Vibration.vibrate(5 * ONE_SECOND_IN_MS);
    setRemainingSeconds(0);
    setIsOn(false);
  };

  const renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={selectedMinutes}
        onValueChange={(itemValue) => {
          setSelectedMinutes(itemValue);
        }}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={selectedSeconds}
        onValueChange={(itemValue) => {
          setSelectedSeconds(itemValue);
        }}
        mode="dropdown"
      >
        {AVAILABLE_SECONDS.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>seconds</Text>
    </View>
  );

  React.useEffect(() => {
    if (isOn) {
      setRemainingSeconds((remainingSeconds) => remainingSeconds - 1);
      const interval = setInterval(() => {
        setRemainingSeconds((remainingSeconds) => {
          if (remainingSeconds === 0 || remainingSeconds < 0) {
            return finish();
          }
          return remainingSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOn]);

  return (
    <View style={styles.container}>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />
      {isOn ? (
        <Text style={styles.countText}>{`${minutes}:${seconds}`}</Text>
      ) : (
        renderPickers()
      )}
      {isOn ? (
        <TouchableOpacity
          onPress={start}
          style={[styles.button, styles.buttonStop]}
        >
          <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={start} style={styles.button}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
