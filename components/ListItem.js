import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

const listItem = (props) =>{
    return(
        <TouchableOpacity onPress={props.onItemPressed}>
        <View
            style={styles.listItem}
        >
            <Image
                style={styles.placeImage}
                source={props.placeImag}
            />
            <Text>
                {props.placeName}
            </Text>
        </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    listItem: {
        width: '100%',
        padding: 10,
        backgroundColor: "#eee",
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    placeImage: {
        marginRight: 10,
        height: 40,
        width: 40
    }
});
export default listItem;