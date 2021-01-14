import styled, { css } from 'styled-components/native';

export const Market = styled.View`
    width: 0;
    /* background:red;  */
  height: 0; 
  /* border-left: 5%  ; */
  /* border-right: 5%  ; */
  /* border-style: solid;  */
  /* border-bottom: 5px  black; */

  border-left-width: 15px;
  border-right-width: 15px ;
  border-top-width: 15px;
  border-bottom-width: 0px;
  border-style : solid;

  border-left-color:transparent;
  border-right-color:transparent;

  border-top-color:#34CB79;
  margin-top:-5px;
  align-self:center;




`;

export const MidMap = styled.View`
    width: 90px;
    height: 70px;
    background-color: #34CB79;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    align-items: center;

`;

export const MapMarkerContainer = styled.View`
	background: transparent;
	/* border-radius: 15px; */
	width: 90px;
	height: 150px;





`;




// width: 90,
// height: 70,
// backgroundColor: '#34CB79',
// flexDirection: 'column',
// borderRadius: 8,
// overflow: 'hidden',
// alignItems: 'center',