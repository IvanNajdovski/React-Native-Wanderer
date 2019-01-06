import React from 'react';
import { FlatList } from 'react-native';

import ListItem from './ListItem';

const placeList = (props) => {

    return(
        <FlatList
            style={{width: '100%'}}
            data={props.places}
            renderItem={(info) => (
                <ListItem
                    placeName={info.item.name}
                    placeImag={info.item.image}
                    onItemPressed={() => props.onItemSelect(info.item.key)}/>
            )}
        />

    )
};

export default placeList;