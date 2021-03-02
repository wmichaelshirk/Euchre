/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel 
 * Colin <ecolin@boardgamearena.com>
 * euchrenisterius implementation : © W Michael Shirk <wmichaelshirk@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on 
 * http://boardgamearena.com. See http://en.boardgamearena.com/#!doc/Studio for 
 * more information.
 * -----
 */

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock"
],
function (dojo, declare) {
    return declare("bgagame.euchrenisterius", ebg.core.gamegui, {
        
        constructor: function() {
            this.cardwidth = 72;
            this.cardheight = 96;
        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function (gamedatas) {
            console.log( "Starting game setup", gamedatas );
            
            // Setting up player boards
            for (let player_id in gamedatas.players) {
                var player = gamedatas.players[player_id];
                         
                // TODO: Setting up players boards if needed
            }
            
            // Player hand
            this.playerHand = new ebg.stock();
            this.playerHand.create(this, $('myhand'), 
                this.cardwidth, this.cardheight);
            this.playerHand.centerItems = true;
            this.playerHand.setSelectionAppearance('class');
            this.playerHand.setSelectionMode(1);
            this.playerHand.image_items_per_row = 13;
            dojo.connect(
                this.playerHand, 
                'onChangeSelection', this, 'onPlayerHandSelectionChanged');

            // Create cards types:
            // include the whole deck, even though only some are used.
            for (let suit = 1; suit <= 4; suit++) {
                for (let rank = 2; rank <= 14; rank++) {
                    // Build card type id
                    let cardTypeId = this.getCardUniqueId(suit, rank)
                    this.playerHand.addItemType(
                        cardTypeId, // item Id
                        cardTypeId, // sorting "weight"
                        `${g_gamethemeurl}img/cardsnew.png`, 
                        cardTypeId  // position in sprite
                    )
                }
            }
            // Add Joker and card backs here.

            // Cards in player's hand
            for (let i in this.gamedatas.hand) {
                let card = this.gamedatas.hand[i]
                let suit = card.type
                let value = card.type_arg
                let uniqueId = this.getCardUniqueId(suit, value)
                this.playerHand.addToStockWithId(uniqueId, card.id)
            }

            // Cards played on table
            for (i in this.gamedatas.cardsontable) {
                var card = this.gamedatas.cardsontable[i];
                var color = card.type;
                var value = card.type_arg;
                var player_id = card.location_arg;
                this.playCardOnTable(player_id, color, value, card.id);
            }

            // Get contract

            
            // Show the trump card (or suit) if it has been chosen 
            // var trumpSuit = this.gamedatas.trumpSuit;
            // var trumpValue = this.gamedatas.trumpValue;
            // this.showTrumpSymbol(trumpSuit);
            // this.showTrumpCard(trumpSuit, trumpValue);     
 

            // Create bids TODO: Probably there is a better way to do this...
            // this.bids = gamedatas.bids;

            // // Create suits
            // this.colors = gamedatas.colors;

            // Display contract if it's an actual contract
            

            // Show icons if necessary
            // this.dealer_id = gamedatas.dealer_id;
            // if (this.dealer_id > 0) {
            //     this.setDealer(this.dealer_id);
            // }

            // this.declarer_id = gamedatas.declarer_id;
            // if (this.declarer_id > 0) {
            //     this.setDeclarer(this.declarer_id);
            // } else {
            //     this.hideDeclarer();
            // }

            // this.accepter_id = gamedatas.accepter_id;
            // if (this.accepter_id > 0) {
            //     this.setPartner(this.accepter_id);
            // } else {
            //     this.hidePartner();
            // }

            // // Update hand counter
            // this.updateHandCounter(gamedatas.handNumber, gamedatas.handsToPlay);

 
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into
        //      a new game state. You can use this method to perform some user 
        //      interface changes at this moment.
        onEnteringState: function ( stateName, args ) {
            console.log( 'Entering state: '+stateName );
            
            
            if (stateName == 'playerTurn') {
                if (this.isCurrentPlayerActive()) {
                    this.canPlayCard = true;
                    // if (args.args._private.possibleCards) {
					// 	this.updatePossibleCards(args.args._private.possibleCards)
					// }
                }
            }
        },

        // onLeavingState: this method is called each time we are leaving a game
        //          state. You can use this method to perform some user 
        //          interface changes at this moment.
        //
        onLeavingState: function ( stateName ) {
            console.log( 'Leaving state: '+stateName );
            
            switch ( stateName ) {
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function (stateName, args) {
            console.log(`onUpdateActionButtons: ${stateName}`);
                      
            if ( this.isCurrentPlayerActive() ) {            
                switch ( stateName ) {
/*               
                 Example:
 
                 case 'myGameState':
                    
                    // Add 3 action buttons in the action status bar:
                    
                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' ); 
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' ); 
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' ); 
                    break;
*/
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */

        // Get card unique identifier based on its suit and rank
        getCardUniqueId: (suit, rank) => (suit - 1) * 13 + (rank - 2),

        makeAjaxCall: function(methodName, args, onError = error => {}) {
            $('pagemaintitletext').innerHTML = _('Sending move to server...')
            $('generalactions').innerHTML = ''
            args.lock = true
            this.ajaxcall(
                `/${this.game_name}/${this.game_name}/${methodName}.html`,
                args, this, result=>{}, onError)
        },


        /* Card Management */
        // This function is called any time the selection changes, or if a
        // automatic play can be checked
        // If only one card is selected and it is time to play it, the move is
        // sent to the server, Otherwise, nothing happens
        checkIfPlay: function(noStateCheck) {
            const items = this.playerHand.getSelectedItems();

            if (!this.canPlayCard) return

            if (items.length === 1) {
                const action='playCard'
                if (noStateCheck || this.checkAction(action, true)) {
                    const cardId = items[0].id;
                    this.makeAjaxCall(action, { id: cardId })
                }
            }
        },

        playCardOnTable: function(player_id, suit, value, card_id) {
            // player_id => direction
            dojo.place(this.format_block('jstpl_cardontable', {
                x: this.cardwidth * (value - 2),
                y: this.cardheight * (suit - 1),
                player_id
            }), `playertablecard_${player_id}`)

            if (player_id != this.player_id) {
                // Some opponent played a card
                // Move card from player panel
                this.placeOnObject(
                    `cardontable_${player_id}`, `playertable_avatar_${player_id}`
                )
            } else {
                // You played a card. If it exists in your hand, move card from 
                // there and remove corresponding item
                if ($(`myhand_item_${card_id}`)) {
                    this.placeOnObject(
                        `cardontable_${player_id}`, `myhand_item_${card_id}`
                    )
                    this.playerHand.removeFromStockById(card_id)
                }
            }
            // In any case: move it to its final destination
            this.slideToObject(
                `cardontable_${player_id}`, `playertablecard_${player_id}`
            ).play()
        },

        ///////////////////////////////////////////////////
        //// Player's action
        
        onPlayerHandSelectionChanged: function () {
            this.checkIfPlay(false)
        },
        
        /* Example:
        
        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/euchrenisterius/euchrenisterius/myAction.html", { 
                                                                    lock: true, 
                                                                    myArgument1: arg1, 
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 }, 
                         this, function( result ) {
                            
                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)
                            
                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );        
        },        
        
        */

        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your euchrenisterius.game.php file.
        
        */
        setupNotifications: function() {
            console.log( 'notifications subscriptions setup' );
            
            dojo.subscribe('newDeal', this, 'notifyNewDeal')
            dojo.subscribe('newHand', this, 'notifyNewHand')
            dojo.subscribe('playCard', this, 'notifyPlayCard')

            dojo.subscribe( 'giveAllCardsToPlayer', this, "notifyGiveAllCardsToPlayer" );

            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        notifyNewDeal: function (notif) {
            // this.updateHandCounter(notif.args.current_hand,
            //     notif.args.hands_to_play);
            // for ( let player_id in this.gamedatas.players) {
            //     this.updatePlayerTrickCount(player_id, 0)
            // }
            // this.dealer = notif.args.dealer_id

            // activate all players, inactive inactive player

        },

        notifyNewHand: function (notif) {
            this.playerHand.removeAll()
            notif?.args?.cards?.forEach(card => {
                let { type: suit, type_arg: value } = card
                let cardId = this.getCardUniqueId(suit, value)
                this.playerHand.addToStockWithId(cardId, card.id)
            })
        },

        notifyPlayCard: function (notif) {
            // play card on the table
            const {

                type: suit,
                type_arg: value,
                id
            } = notif?.args?.card
            this.playCardOnTable(notif.args.player_id, suit, value, id);
        },

        notifyGiveAllCardsToPlayer : function(notif) {
            // Move all cards on table to given table, then destroy them
            var winner_id = notif.args.player_id;
            self = this;
            for ( var player_id in this.gamedatas.players) {
                var anim = this.slideToObject('cardontable_' + player_id, 'playertable_avatar_' + winner_id);
                dojo.connect(anim, 'onEnd', function(node) {
                    // dojo.destroy(node);
                    self.fadeOutAndDestroy(node, 500);
                });
                anim.play();
            }
        },


   })
})
