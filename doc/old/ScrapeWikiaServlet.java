package com.yugiohcalculator;
import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;

import org.jsoup.*;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;

@SuppressWarnings("serial")
public class ScrapeWikiaServlet extends HttpServlet {

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String url = request.getParameter("url");
		String ua = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 " +
				"(KHTML, like Gecko) Chrome/28.0.1468.0 Safari/537.36";

		// Try to connect to the posted url
		Connection.Response wikiaResponse = null;
		int statusCode;
		try {
			wikiaResponse = Jsoup.connect(url)
					.userAgent(ua)
					.timeout(10000)
					.execute();

			// If the connection is successful, a 200 will be returned
			statusCode = wikiaResponse.statusCode();
		}
		catch (HttpStatusException hse) {

			// If the connection fails, some other code will be returned
			statusCode = hse.getStatusCode();
		}

		String responseText;

		// If the page existed, get the ruling info
		if (statusCode == 200) {
			Document doc = wikiaResponse.parse();

			// Get the main rulings div
			Element content = doc.getElementById("WikiaArticle");

			// Remove all extra, unneeded elements
			content.select(".navbox, .home-top-right-ads, " +
					".RelatedPagesModule, .printfooter, noscript, " +
					"a:contains(Edit)").remove();

			// Remove any inline styling
			content.getElementsByAttribute("style").removeAttr("style");

			// Convert all links with a title to absolute paths
			Elements titledAnchors = content.select("a[title]");
			for (Element anchor : titledAnchors) {
				anchor.attr("href",
						"http://yugioh.wikia.com" + anchor.attr("href"));
				anchor.attr("target", "_blank");
			}

			// Make all links with the "external" class open in new windows
			Elements externalAnchors = content.select("a.external");
			for (Element anchor : externalAnchors) {
				anchor.attr("target", "_blank");
			}

			// The first h1 tag contains the title of this document
			String title =
					doc.getElementById("WikiaPageHeader")
					.select("h1:eq(0)")
					.text();

			// Append attribution text to the content
			content.append(
				"<div id=\"wikia-attribution\">" +
					"These rulings were retrieved from the " +
					"<a target=\"_blank\" href=\"" + url + "\">\"" +
					title + "\"</a> " + "article on the <a target=\"_blank\" " +
					"href=\"http://yugioh.wikia.com/\">Yu-Gi-Oh! Wiki</a> " +
					"at <a target=\"_blank\" href=\"http://www.wikia.com/\">" +
					"Wikia</a> and are licensed under the " +
					"<a target=\"_blank\" href=\"" +
					"http://creativecommons.org/licenses/by-sa/3.0/\">" +
					"Creative Commons Attribution-Share Alike License</a>." +
				"</div>"
			);

			// Convert the content to send-able string form
			responseText = content.toString();
		}
		// If the page didn't exist, then spit back an error
		else {
			responseText =
				"<div id=\"scrape-error\">" +
					"Unable to access yugioh.wikia.com (" + statusCode +
					")." +
					"<ul>" +
						"<li>You may have misspelled this card's name above." +
						"</li>" +
						"<li>This card may not have any rulings.</li>" +
						"<li>Wikia's site may be currently unavailable.</li>" +
					"</ul>" +
				"</div>";
		}

		// Send a response back to the user
		response.setContentType("text/plain");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(responseText);
	}
}
