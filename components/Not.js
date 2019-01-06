import React from 'react';
import { Text, Button, View } from 'react-native';

const Not = (props) => {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Not</Text>
            <Button
                title="Go to Hello"
                onPress={() => props.navigation.navigate('Home')}
            />
        </View>

    )
};
export default Not;