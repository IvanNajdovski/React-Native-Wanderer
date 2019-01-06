import React from 'react';
import { View, Text, Button } from 'react-native';

const Hello = (props) => {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Hello</Text>
            <Button
                title="Go to Not"
                onPress={() => props.navigation.navigate('Not')}
            />
        </View>

    )
};

export default Hello;