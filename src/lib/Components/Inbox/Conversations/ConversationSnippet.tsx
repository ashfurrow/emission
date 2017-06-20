import * as moment from "moment"
import * as React from "react"
import * as Relay from "react-relay/classic"

import { MetadataText, PreviewText as P, SmallHeadline } from "../Typography"

import { StyleSheet, TouchableWithoutFeedback, ViewStyle } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"
import OpaqueImageView from "../../OpaqueImageView"

const Card = styled.View`
  margin: 10px 20px 0;
  minHeight: 80px;
`

const VerticalLayout = styled.View`
  flex: 1;
  flex-direction: column;
`

const HorizontalLayout = styled.View`
  flex: 1;
  flex-direction: row;
`

const CardContent = styled(HorizontalLayout)`
  justify-content: space-between;
`

const TextPreview = styled(VerticalLayout)`
  margin-left: 15;
`

const DateHeading = styled(HorizontalLayout)`
  justify-content: flex-end;
  margin-bottom: 4;
`

const UnreadIndicator = styled.View`
  height: 8;
  width: 8;
  border-radius: 4;
  background-color: ${colors["purple-regular"]};
  marginLeft: 4;
  marginVertical: 3;
`

const Separator = styled.View`
  height: 1;
  width: 100%;
  background-color: ${colors["gray-regular"]};
  margin-top: 18px;
  margin-bottom: 5px;
`

const ArtworkSubtitle = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 16px;
  color: black;
  margin-top: 6;
  margin-bottom: 2;
`

const ArtworkTitle = styled(ArtworkSubtitle)`
  font-family: ${fonts["garamond-italic"]};
`

const ImageView = styled(OpaqueImageView)`
  width: 58px;
  height: 58px;
  borderRadius: 4px;
`

export interface Conversation {
  id: string | null
  from: {
    email: string | null
    name: string | null
  }
  to: {
    name: string | null
  }
  last_message: string | null
  last_message_at: string | null
  artworks: Array<
    {
      id: string | null
      href: string | null
      title: string | null
      date: string | null
      artist_names: string | null
      image: {
        url: string | null
      }
    }
  >
}

interface Props {
  conversation: Conversation
  onSelected?: () => void
}

export class ConversationSnippet extends React.Component<Props, any> {
  render() {
    const conversation = this.props.conversation
    const artwork = conversation.artworks[0]

    const partnerName = conversation.to.name
    const artworkTitle = `${artwork.title.trim()}, `
    const artworkDate = `${artwork.date}`
    const artworkArtist = `${artwork.artist_names} · `
    const conversationText = conversation.last_message.replace(/\n/g, " ")
    const date = moment(conversation.last_message_at).fromNow(true)
    const imageURL = artwork.image.url

    return (
      <TouchableWithoutFeedback onPress={this.props.onSelected}>
        <Card>
          <CardContent>
            <ImageView imageURL={imageURL} />
            <TextPreview>
              <HorizontalLayout>
                <SmallHeadline>{partnerName}</SmallHeadline>
                <DateHeading>
                  <MetadataText>{date}</MetadataText>
                  <UnreadIndicator />
                </DateHeading>
              </HorizontalLayout>
              <HorizontalLayout>
                <P>
                  <ArtworkSubtitle>{artworkArtist}</ArtworkSubtitle>
                  <ArtworkTitle>{artworkTitle}</ArtworkTitle>
                  <ArtworkSubtitle>{artworkDate}</ArtworkSubtitle>
                </P>
              </HorizontalLayout>
              <P>{conversationText}</P>
            </TextPreview>
          </CardContent>
          <Separator />
        </Card>
      </TouchableWithoutFeedback>
    )
  }
}

export default Relay.createContainer(ConversationSnippet, {
  fragments: {
    conversation: () => Relay.QL`
      fragment on ConversationType {
        id
        from {
          name
          email
        }
        to {
          name
        }
        last_message
        last_message_at
        artworks {
          id
          href
          title
          date
          artist_names
          image {
            url
          }
        }
      }
    `,
  },
})
