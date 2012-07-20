/*

Mailtwo.js - A better way to handle 'mailto:' links across your site

J. Ky Marsh, jkymarsh@gmail.com
Copyright (c) 2012

*/

;(function($, window, document, undefined) {
    // create the defaults and set up the constructor for the plugin itself
    var pluginName = "mailtwo",
        defaults = {
            modalBgClass: "mailtwoBackground",
            modalClass: "mailtwoModal"
            // facebook/twitter/linkedin have no defaults; no point in initializing an empty option!
        },
        Plugin = function(element, options) {
            // "this.defaults" and "this.name" available to the object but not used within
            //  the context of this plugin
            this.element = element;
            this.defaults = defaults;
            this.name = pluginName;
            this.options = $.extend({}, defaults, options);

            // run init method immediately upon creation of the plugin
            this.init();
        };

    Plugin.prototype.constructModal = function(options) {
        var modalBgElement = ("." + options.modalBgClass),
            modalElement = ("." + options.modalClass);

        console.log(options);
        console.log(modalBgElement);

        var constructModal = function() {
            var $modal = $("<div />"),
                modalInner = "",
                socialMediaSites = ["facebook", "twitter", "linkedin"],
                socialMediaAccounts = [options.facebook, options.twitter, options.linkedin];

            console.log(socialMediaSites);
            console.log(socialMediaAccounts);

            modalInner += "<span>Contact Me</span>"
                        + "<a href=\"#\" id=\"closeMailtwoModal\"></a>"
                        + "<ul>"
                        + "<li><span>Send me an email:</span>"
                        + "<input type=\"text\" id=\"mailtwoInput\" placeholder=\"Subject\" />"
                        + "<textarea id=\"mailtwoTextarea\" placeholder=\"Message\"></textarea>"
                        + "<a href=\"" + options.emailFull + "&subject=&body=\" id=\"sendMailtwoEmail\" target=\"_blank\">Send</a>"
                        + "</li>";

            for (var i = 0; i < socialMediaSites.length; i++) {
                if (socialMediaAccounts[i]) {
                    modalInner += "<li>"
                            + "<a href=\"http://" + socialMediaSites[i] + ".com/"
                            + socialMediaAccounts[i] + "\" target=\"_blank\" class=\"mailtwo"
                            + socialMediaSites[i] + "\"></a>"
                            + "</li>";
                }
            }

            modalInner += "</ul>";

            $modal
                .addClass(options.modalClass)
                .html(modalInner);

            return $modal;
        }

        if ($("body").children(modalBgElement).length === 0) {
            $("<div />")
                .addClass(options.modalBgClass)
                .html(constructModal())
                .appendTo("body");
        }
        else {
            $(modalBgElement)
                .html(constructModal());
        }

        $(modalElement).css({
            top: "50%",
            left: "50%",
            "margin-left": (-($(modalElement).outerWidth() / 2)),
            "margin-top": (-($(modalElement).outerHeight() / 2))
        });

    }

    // METHOD: initialization method for the plugin fires after setup is complete,
    //  element and options are instantly available to the object. after setup,
    //  relevant method will be called based on user-defined "mode"
    Plugin.prototype.init = function() {
        var plugin = this,
            $element = $(this.element),
            options = this.options;

        options.emailFull = $element.attr("href");
        // options.emailParsed = options.emailFull.split(":")[1];
        options.facebook = options.facebook || $element.attr("data-facebook");
        options.twitter = options.twitter || $element.attr("data-twitter");
        options.linkedin = options.linkedin || $element.attr("data-linkedin");

        console.log($element);
        console.log(options.emailFull);

        if (((options.emailFull.indexOf("[at]")) > -1) || ((options.emailFull.indexOf("[dot]")) > -1)) {
            console.log(options.emailFull.indexOf("[at]"));

            options.emailFull = options.emailFull.replace("[at]", "@");
            options.emailFull = options.emailFull.replace("[dot]", ".");
        }

        console.log(options.emailFull);

        $element.on("click", function(evt) {
            evt.preventDefault();

            plugin.constructModal(options);

            $("." + options.modalBgClass).show();

            // console.log($("." + options.modalBgClass).css("display"));
        });

        $(document).on("click", "#closeMailtwoModal", function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            $("." + options.modalBgClass).hide();

            // console.log($("." + options.modalBgClass).css("display"));
        });

        $(document).on("keyup", "#mailtwoTextarea, #mailtwoInput", function(evt) {
            var emailLink = ($("#sendMailtwoEmail").attr("href")),
                emailLinkSubject = (emailLink.match(/(&subject=)[^&]*/)),
                emailLinkMessage = (emailLink.match(/(&body=)[^&]*/));

            evt.stopImmediatePropagation();

            console.log(evt.currentTarget.id);

            if (evt.currentTarget.id === "mailtwoInput") {
                emailLink = emailLink.replace(emailLinkSubject[0], ("&subject=" + $("#mailtwoInput").val()));
            }
            else {
                emailLink = emailLink.replace(emailLinkMessage[0], ("&body=" + $("#mailtwoTextarea").val()));
            }

            emailLink = emailLink.replace(/\s/g, "%20");

            console.log(emailLink);
            console.log(emailLinkSubject);
            console.log(emailLinkMessage);

            $("#sendMailtwoEmail").attr("href", emailLink);
        });
    };

    // a lightweight plugin wrapper around the constructor, preventing against
    //  multiple instantiations
    $.fn[pluginName] = function(options) {
        var attachPlugin = function() {
            var linkText = ($(this).attr("href"));

            console.log($(this));
            console.log(linkText);

            if (linkText.indexOf("mailto:") > -1) {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName, new Plugin(this, options));
                }

                console.log("IS A MAILTO: LINK");
            }
            else {
                console.log("is not a mailto: link");
            }

        }

        return this.each(function() {
            // if element isn't a link, find actual links within the element and
            //  attach the plugin instantiation to each of them

            // TODO: if "a" element doesn't start with "mailto:" then do nothing
            if (!$(this).attr("href")) {
                $(this).find("a").each(function() {
                    attachPlugin.call(this);
                });
            }
            // otherwise, just attach the plugin to the specified link element
            else {
                attachPlugin.call(this);
            }

        });
    };

})(jQuery, window, document);