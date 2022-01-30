+++
title = "qa"
date = 2019-09-29T09:59:00-04:00
domain = "proactivedirectory"
identifier = "viz"
image = "/img/graph-model.png"
tags = ["value_1", "value_2"]
draft = false
iama = "action"
episode = ""
cypher = "MATCH (n:Computer) RETURN n LIMIT 5"
result = "52"
target = "5"
teaser = ""
author = ""
+++


# create_qa_statistics

	def create_qa_statistics(self, sheet):
		session = self.driver.session()
		computer_local_admin_pct = 0
		computer_session_pct = 0
		user_session_pct = 0
		
		query = """MATCH (n)-[:AdminTo]->(c:Computer {domain:{domain}})
					WITH COUNT(DISTINCT(c)) as computersWithAdminsCount
					MATCH (c2:Computer {domain:{domain}})
					RETURN toInt(100 * (toFloat(computersWithAdminsCount) / COUNT(c2)))
					"""
		for result in session.run(query, domain=self.domain):
			computer_local_admin_pct = result[0]
		
		query = """MATCH (c:Computer {domain:{domain}})-[:HasSession]->()
					WITH COUNT(DISTINCT(c)) as computersWithSessions
					MATCH (c2:Computer {domain:{domain}})
					RETURN toInt(100 * (toFloat(computersWithSessions) / COUNT(c2)))
					"""
		
		for result in session.run(query, domain=self.domain):
			computer_session_pct = result[0]

		query = """MATCH ()-[:HasSession]->(u:User {domain:{domain}})
					WITH COUNT(DISTINCT(u)) as usersWithSessions
					MATCH (u2:User {domain:{domain},enabled:true})
					RETURN toInt(100 * (toFloat(usersWithSessions) / COUNT(u2)))
					"""
		
		for result in session.run(query, domain=self.domain):
			user_session_pct = result[0]
		
		session.close()
		self.write_single_cell(sheet, 2, 3, "Computers With Local Admin Data: {}%".format(computer_local_admin_pct))
		self.write_single_cell(sheet, 3, 3, "Computers With Session Data: {}%".format(computer_session_pct))
		self.write_single_cell(sheet, 4, 3, "Users With Session Data: {}%".format(user_session_pct))