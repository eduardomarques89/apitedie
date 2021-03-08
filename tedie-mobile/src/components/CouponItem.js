import React from 'react'
import { Ionicons } from '@expo/vector-icons'
// components
import ContentContainer from './ContentContainer'
import Box from './Box'
import Typography from './Typography'
import Divider from './Divider'
// theme
import theme from '../theme'

const CouponItem = ({ coupon }) => {
  return (
    <ContentContainer>
      <Box direction="column" justify="flex-start" alignItems="center">
        <Box direction="row" justify="flex-start" alignItems="center">
          <Ionicons name="md-pricetag" size={25} color={theme.palette.primary} />
          <Typography size="medium" color={theme.palette.dark}>
            {coupon.Codigo}
          </Typography>
        </Box>

        <Typography size="small" color={theme.palette.light}>
          {coupon.NomeCupom} - R$ {Number.parseFloat(coupon.Valor).toFixed(2).replace('.', ',')}
        </Typography>

        <Divider />

        <Typography size="small" color={theme.palette.light}>
          Válido até {coupon.Final}
        </Typography>
      </Box>
    </ContentContainer>
  )
}

export default CouponItem
