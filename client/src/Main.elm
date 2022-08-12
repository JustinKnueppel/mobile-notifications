module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (type_, value)
import Html.Events exposing (onClick, onInput, onSubmit)


main : Program () Model Msg
main =
    Browser.sandbox
        { init = init
        , view = view
        , update = update
        }


type alias Model =
    { name : String
    , currentName : String
    }


init : Model
init =
    { name = "Justin", currentName = "" }


type Msg
    = NameModified String
    | NameUpdated


update : Msg -> Model -> Model
update msg model =
    let
        _ =
            Debug.log model.currentName
    in
    case msg of
        NameModified name ->
            { model | currentName = name }

        NameUpdated ->
            { model | currentName = "" }



-- { model | name = model.currentName, currentName = "" }


view : Model -> Html Msg
view model =
    div []
        [ text ("Hello " ++ model.name ++ "!")
        , input [ type_ "text", onInput NameModified ] []
        , button [ type_ "button", onClick NameUpdated, value model.currentName ] [ text "Change name" ]
        ]
