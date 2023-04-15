import React, {useState} from 'react';
import { TextInput, StyleSheet, View, Text, Button, FlatList, Image, Modal,TouchableOpacity} from 'react-native';
import 광고 from '../assets/광고.png';
import keypad from '../assets/keypad.png';
import axios from "axios";
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import QRCode from 'react-native-qrcode-svg';

const Body = () => {
    const [prdnm, setPrdnm] = useState([]); //상품 이름
    const [data, setData] = useState(' '); // NFC에 보낼 정보 (알러지 정보, 상품 이름) 
    const [saveText, setSaveText] = useState(''); //가장 최근에 찍힌 상품 고유번호
    const [inputText, setInputText] = useState(''); //바코드를 찍으면 InputText에 들어온 후 
    const [modalVisible, setmodalVisible] = useState(false);
    return (
        <View style = {styles.body}>
            <Modal
                style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
                animationType='fade'
                transparent={true}
                onRequestClose={()=>setmodalVisible(false)}
                visible={modalVisible}               
            >
                <TouchableOpacity 
                    style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}} 
                    activeOpacity={1} 
                    onPressOut={() => {setmodalVisible(false)}}
                >
                    <View  style={{padding:50 , backgroundColor:'#fff', borderRadius: 10}}>
                        <QRCode
                            size= {300}
                            value = {data}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
            <View style = {styles.item1}>
                <View style={styles.content}>
                    <TextInput
                        style={styles.testInput}
                        onChangeText={(text) => {
                        //this.setState({inputText: text});
                            setInputText(text);
                            setSaveText(text);
                            setTimeout(()=>{ setInputText('') }, 650);
                        }}

                        onSubmitEditing={async () => {
                            const BAR_CODE = saveText;
                            try {
                                const res = await axios.get(
                                    'https://world.openfoodfacts.org/product/'+BAR_CODE 
                                );
                                let nm = res.data.split("<title>")[1].split('</title>')[0].trim();
                                let a= nm + '&' + res.data.split("Allergens:</strong>")[1].split('</div>')[0].trim() + '/';
                                setData(data+a)
                                setPrdnm([...prdnm,nm])
                            } catch (error) {
                                    console.log(error);
                            }
                        }}
                        keyboardType='numeric'
                        value={inputText}
                        blurOnSubmit={false}
                    />
                    <FlatList
                        style= {styles.itemlist}
                        data= {prdnm}
                        renderItem = {({item}) =>{
                            return (
                                <View>
                                    <Text style={styles.item}>{item}</Text>
                                </View>
                            )
                        }}
                        keyExtractor ={(item) => item.id}
                    />
                </View>           
            </View>
            <View style={styles.item2}>           
                <View>
                    <Image 
                        source = {광고}
                        style = {styles.iAdvertise}
                    />
                </View>
                <View>
                    <Image 
                        source = {keypad}
                        style = {styles.iKeypad}
                    />
                </View>
                
                <TouchableOpacity>
                    <View style = {styles.iButtonBox}>
                        <Text style = {styles.iButtonText}>Membership</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style = {styles.iButtonBox}>
                        <Text style = {styles.iButtonText}>Receipt</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPressOut={()=>setmodalVisible(true)}
                >
                    <View style = {styles.iButtonBox}>
                        <Text style = {styles.iButtonText}>QR</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style = {styles.iButtonBox}>
                        <Text style = {styles.iButtonText}>Cancel</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPressOut={()=>{setPrdnm([]);
                            setData('');
                            setInputText('');
                            setSaveText('');}}
                >
                    <View style = {{
                                    marginBottom: 5,
                                    padding: 5,
                                    paddingBottom: 20,
                                    paddingTop : 20,
                                    backgroundColor: "#1A65CE",
                                    borderRadius: 7,
                                    alignItems: 'center',
                                    fontWeight: 10
                                }}>
                        <Text style = {styles.iButtonText}>구매</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create ({
    body: {
        flex: 9,
        flexDirection: 'row',
        borderBottomWidth: 3,
        borderBottomColor : '#5A5AFF',
        backgroundColor : '#F2FAFF',
    },

    item1: {
        flex: 2,
        flexDirection: 'row',
        borderRightColor : '#5A5AFF',
        borderRightWidth : 3,
    },
    item2: {
        flex: 1,
    },
    iKeypad: {
        height: 400,
        width : 260,
        marginTop : 5,
        marginBottom : 5,
        paddingLeft : 3,
        paddingRight : 3,
    },

    iAdvertise: {
        height: 100,
        width : 270,
        paddingLeft : 6,
        paddingRight: 6,
    },
    
    iButtonBox: {
        marginBottom: 5,
        padding: 5,
        paddingBottom: 20,
        paddingTop : 20,
        backgroundColor: "#68C2FF",
        borderRadius: 7,
        alignItems: 'center',
        fontWeight: 10
    },
    iButtonText: {
        color: 'white',
        fontSize: 25,
    },
    iButton: {
        padding: 5,
    },

    NFCButton: {
        height: 25,
        backgroundColor: 'green',
    },

    buyButton: {
        height : 50,
        backgroundColor : 'red'
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        height: 450,
    },
    testInput: {
        color: 'transparent',
    },
    itemlist: {
        textAlign: "left",
        paddingLeft : 5,
        paddingRight : 5,
        width : '100%'
    },
    item: {
        fontSize: 40,
        color: 'black',
        borderBottomColor : '#5A5AFF',
        borderBottomWidth : 1,
        marginBottom : 8,
        borderStyle : 'dashed',
    },

})

export default Body;