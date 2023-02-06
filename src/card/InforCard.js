import { Card, CardHeader, CardBody, CardFooter ,Text,Heading,Button  ,Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,} from '@chakra-ui/react'
    import {  InfoIcon } from '@chakra-ui/icons'
import React from 'react'
import CcButton from '../CcButton'
export default function InforCard() {
    const goerliStakeAddress="0x048Bd6BF26C3305c354aEFab0cb5D7D12D290688"
  return (
    <>
   <Card align='center' width={500}>
  <CardHeader>
    <Heading size='md'> SecureStake</Heading>
  </CardHeader>
  <CardBody>
    <Text>
        <Text>Welcome to SecureStake, 
        the one-stop platform for secure escrow staking and lending solutions. Our mission is to provide our users with a safe and convenient way to earn passive income through staking and lending while ensuring the security of their funds.
        </Text>
<Text>With our escrow staking system, you can easily 
stake your digital assets and earn interest with no hassle while your organization archive the goals of your escrow contracts.</Text>
<Text>
 Our platform offers competitive interest rate <strong>(Currently %30)</strong> and allows you to earn returns without having to worry about the security of your funds.
 
 </Text>
 <Text><strong>!!WARNING Our contract deployments locks the funds for 3 month incase you choose to stake with interest --- You can check through the ether scan </strong></Text>
 <Text>
 Our lending services are secure, fast, and flexible, allowing you to get the funds you need when you need them.
 </Text>
At SecureStake , we believe in providing the best possible experience for our users. Our platform is user-friendly, reliable, and secure, ensuring that you can stake, earn, and initiate your cescrow contracts  with confidence.
</Text>
<Text>Please check our customer's contracts down below in Archived contracts section </Text>

  </CardBody>
  <CardFooter>
  <Popover>
  <PopoverTrigger>
    <Button colorScheme={'blue'}>Click to see our Stake contract address </Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverHeader alignSelf={'center'}><InfoIcon/> <strong>StakeSecure</strong> <InfoIcon/> </PopoverHeader>
    <PopoverBody><strong>Goerli Chain</strong> {goerliStakeAddress.slice(0,9)}...{goerliStakeAddress.slice(-9)} <CcButton text={goerliStakeAddress}/></PopoverBody>
  </PopoverContent>
</Popover>
  </CardFooter>
</Card>
  </>
  )
}
