<?php 
	
	$DBNAME = 'surveyfill';
	$DBUSER = 'bceesql';
	$DBPASS = 'bceepass';
	$DBHOST = 'localhost';
	
	$SALT = "hdsz874rk^%$^%#(*43yu89^^(^*-*)&*uy38)()*(&76#!@!#@%$#%^%^sdgfiasngf";
	$METHOD = $_SERVER['REQUEST_METHOD'];
	$URI_DATA = $pieces = explode("/", $_SERVER['REQUEST_URI']);
	
	$table = $URI_DATA[2];
	$res = [];
		
	$mysqli = new mysqli($DBHOST, $DBUSER, $DBPASS, $DBNAME);	
	
	if ($table === 'users') {
		if($URI_DATA[3] === 'register') {
			$hashedPass = hash('sha256', $_REQUEST['password'].$SALT);
			$sql = 'INSERT INTO '.$table.' (username, email, password) VALUES ("'.$_REQUEST["username"].'", "'.$_REQUEST["email"].'", "'.$hashedPass.'");';
			if ($mysqli->connect_error) {
				$res['error'] = $mysqli->connect_error;
			} else {
				if ($mysqli->query($sql) == TRUE) {
					$userId = $mysqli->insert_id;
					if($result = $mysqli->query('SELECT username, password FROM users WHERE userId = '.$id.';')){
						$row = $result->fetch_assoc();
						$authtoken = $row['password'];
						$res['username'] = $row['username'];
						$res['userId'] = $userId;
						$res['authtoken'] = $authtoken;
						$res['success'] = 'Welcome, ' . $res['username'] . '!';
						$result->free();
					} else {
						$res['error'] = "Error: " . $mysqli->error;
					}
				} else {
					$res['error'] = "Error: " . $mysqli->error;
				}
			}
			$mysqli->close();
			echo json_encode($res);
		} else if($URI_DATA[3] === 'login') {
			$sql = 'SELECT userId, password FROM users WHERE username = "'.$_REQUEST['username'].'";';
			if ($mysqli->query($sql) == TRUE) {
					if($result = $mysqli->query($sql)){
						$row = $result->fetch_assoc();
						$hashedPass = hash('sha256', $_REQUEST['password'].$SALT);
						if($hashedPass !== $row['password']) {
							$res['error'] = "Wrong credentials!";
						} else {
							$authtoken = $row['password'];
							$res['username'] = $_REQUEST['username'];
							$res['userId'] = $row['userId'];
							$res['authtoken'] = $authtoken;
							$res['success'] = 'Welcome, ' . $_REQUEST['username'] . '!';
						}
						$result->free();
					} else {
						$res['error'] = "Error: " . $mysqli->error;
					}
				} else {
					$res['error'] = "Error: " . $mysqli->error;
				}
			$mysqli->close();
			echo json_encode($res);
		} else if($URI_DATA[3] === 'logout') {
			$res['success'] = 'Bye, bye! ';
			echo json_encode($res);
		} else {
			$mysqli->close();
		}
	} else if ($table === 'types_of_questions') {
		$sql = 'SELECT id AS value, name FROM types_of_questions;';
		if ($mysqli->query($sql) == TRUE) {
			if($result = $mysqli->query($sql)){
				while($row = $result->fetch_array()) {
					unset($row[0]);
					unset($row[1]);
					$res[] = $row;
				}
				$result->free();
			} else {
				$res['error'] = "Error: " . $mysqli->error;
			}
		} else {
			$res['error'] = "Error: " . $mysqli->error;
		}
		$mysqli->close();
		echo json_encode($res);
		
	} else if ($table === 'surveys') {
		if ($URI_DATA[3] === 'add') {
			$userId;
			$sql = 'SELECT userId FROM users WHERE password = "'.$_REQUEST['authtoken'].'";';
			if ($mysqli->query($sql) == TRUE) {
				if($result = $mysqli->query($sql)){
					$userId = $result->fetch_array()['userId'];
					$result->free();
					if ($userId != $_REQUEST['userId']) {
						$res['error'] = "Wrong credentials!";
					} else {
						$sql = 'INSERT INTO surveys (userId, title, notes) VALUES 
								('.$userId.', "'.$_REQUEST['title'].'", "'.$_REQUEST['notes'].'");';
						if ($mysqli->query($sql) == TRUE) {
							$surveyId = $mysqli->insert_id;
							for ($i = 0; $i < count($_REQUEST['sections']); $i++) {
								$sql = 'INSERT INTO sections (surveyId, sectionTitle) VALUES 
									('.$surveyId.', "'.$_REQUEST['sections'][$i]['sectionTitle'].'");';
								if ($mysqli->query($sql) == TRUE) {
									$sectionId = $mysqli->insert_id;
									for ($j = 0; $j < count($_REQUEST['questions']); $j++) {
										if ($_REQUEST['sections'][$i]['sectionId'] === $_REQUEST['questions'][$j]['sectionId']) {
											$isRequired = FALSE;
											if ($_REQUEST['questions'][$j]['isRequired'] > 0) {
												$isRequired = TRUE;
											}
											$res['isRequired'] = $isRequired;
											$sql = 'INSERT INTO questions (sectionId, questionTitle, typeId, isRequired) VALUES 
												('.$sectionId.', "'.$_REQUEST['questions'][$j]['questionTitle'].'", "'.$_REQUEST['questions'][$j]['typeId'].'", "'.$isRequired.'");';
											if ($mysqli->query($sql) == TRUE) {
												$questionId = $mysqli->insert_id;
												if ($_REQUEST['questions'][$j]['typeId'] > 2) {
													$sql = 'INSERT INTO possibilities (questionId, possibilityTitle) VALUES 
																('.$questionId.', "Free value");';
												} else {
													for ($k = 0; $k < count($_REQUEST['possibilities']); $k++) {
														if ($_REQUEST['sections'][$i]['sectionId'] === $_REQUEST['possibilities'][$k]['sectionId']
														&& $_REQUEST['questions'][$j]['questionId'] === $_REQUEST['possibilities'][$k]['questionId']) {
															$sql = 'INSERT INTO possibilities (questionId, possibilityTitle) VALUES 
																('.$questionId.', "'.$_REQUEST['possibilities'][$k]['possibilityTitle'].'");';
															if ($mysqli->query($sql) != TRUE) {
																$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
															}
														}
													}
												}
											} else {
												$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
											}
										}
									}
								} else {
									$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
								}
							}
							$res['success'] = "Successfully add new survey!";
						} else {
							$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
						}
					}
				} else {
					$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
				}
			} else {
				$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
			}
		} else if ($URI_DATA[3] === 'edit') {
				$userId;
				$sql = 'SELECT userId, role FROM users WHERE password = "'.$_REQUEST['authtoken'].'";';
				if ($mysqli->query($sql) == TRUE) {
					if($result = $mysqli->query($sql)) {
						$userData = $result->fetch_array();
						$userId = $userData['userId'];
						$userRole = $userData['role'];
						$result->free();
						if ($userId != $_REQUEST['userId'] && $userRole !== 'admin') {
							$res['error'] = "Wrong credentials!";
						} else {
							$sql = 'UPDATE surveys SET title = "'.$_REQUEST['title'].'", notes="'.$_REQUEST['notes'].'" WHERE surveyId = '.$_REQUEST['survey'][0]['surveyId'].';';
							if ($mysqli->query($sql) == TRUE) {
								for ($i = 0; $i < count($_REQUEST['sections']); $i++) {
									$sql = 'UPDATE sections SET sectionTitle = "'.$_REQUEST['sections'][$i]['sectionTitle'].'" WHERE sectionId = '.$_REQUEST['sections'][$i]['sectionId'].';';
									if ($mysqli->query($sql) == TRUE) {
										for ($j = 0; $j < count($_REQUEST['questions']); $j++) {
											$isRequired = FALSE;
											if ($_REQUEST['questions'][$j]['isRequired'] > 0) {
												$isRequired = TRUE;
											}
											$sql = 'UPDATE questions SET questionTitle = "'.$_REQUEST['questions'][$j]['questionTitle'].'", isRequired= "'.$isRequired.'" WHERE questionId = '.$_REQUEST['questions'][$j]['questionId'].';';
												if ($mysqli->query($sql) == TRUE) {
													for ($k = 0; $k < count($_REQUEST['possibilities']); $k++) {
														$sql = 'UPDATE possibilities SET possibilityTitle = "'.$_REQUEST['possibilities'][$k]['possibilityTitle'].'" WHERE possibilityId = '.$_REQUEST['possibilities'][$k]['possibilityId'].';';
														if ($mysqli->query($sql) != TRUE) {
															$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
														}
													}
												} else {
													$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
												}
										}
									} else {
										$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
									}
								}
								$res['success'] = "Successfully add new survey!";
							} else {
								$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
							}
						}
					} else {
						$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
					}
				} else {
					$res['error'] = "Error: " . $mysqli->error . " in " . $sql;
				}
			 
		} else if ($URI_DATA[3] === 'get') {
			$sql = 'SELECT * FROM surveys AS survey WHERE survey.surveyId = '.$_REQUEST['id'].';';
			if ($mysqli->query($sql) == TRUE) {
				if($result = $mysqli->query($sql)){
					$survey = [];
					while($row = $result->fetch_assoc()) {
						unset($row[0]);
						unset($row[1]);
						$survey[] = $row;
					}
					$res['survey'] = $survey;
					$result->free();
				} else {
					$res['error'] = "Error: " . $mysqli->error;
				}
			} else {
				$res['error'] = "Error: " . $mysqli->error;
			}
			$sql = 'SELECT * FROM sections AS sections WHERE sections.surveyId = '.$_REQUEST['id'].';';
			if ($mysqli->query($sql) == TRUE) {
				if($result = $mysqli->query($sql)){
					$sections = [];
					while($row = $result->fetch_assoc()) {
						unset($row[0]);
						unset($row[1]);
						$sections[] = $row;
					}
					$res['sections'] = $sections;
					$result->free();
				} else {
					$res['error'] = "Error: " . $mysqli->error;
				}
			} else {
				$res['error'] = "Error: " . $mysqli->error;
			}
			$sectionsIds = [];
			for($i = 0; $i < count($res['sections']); $i++){
				$sectionsIds[] = $res['sections'][$i]['sectionId'];
			}
			$sql = 'SELECT * FROM questions AS questions WHERE questions.sectionId IN('.join(", ",$sectionsIds).');';
			if ($mysqli->query($sql) == TRUE) {
				if($result = $mysqli->query($sql)){
					$questions = [];
					while($row = $result->fetch_assoc()) {
						unset($row[0]);
						unset($row[1]);
						$questions[] = $row;
					}
					$res['questions'] = $questions;
					$result->free();
				} else {
					$res['error'] = "Error: " . $mysqli->error;
				}
			} else {
				$res['error'] = "Error: " . $mysqli->error;
			}
			$questionsIds = [];
			$sql = 'SELECT p.*, ss.sectionId FROM surveys AS s JOIN sections AS ss ON s.surveyId = ss.surveyId JOIN questions AS q ON q.sectionId = ss.sectionId JOIN possibilities AS p ON p.questionId = q.questionId WHERE s.surveyId = '.$_REQUEST['id'].';';
			if ($mysqli->query($sql) == TRUE) {
				if($result = $mysqli->query($sql)){
					$possibilities = [];
					while($row = $result->fetch_assoc()) {
						unset($row[0]);
						unset($row[1]);
						$possibilities[] = $row;
					}
					$res['possibilities'] = $possibilities;
					$result->free();
				} else {
					$res['error'] = "Error: " . $mysqli->error;
				}
			} else {
				$res['error'] = "Error: " . $mysqli->error;
			}
			$sql = 'SELECT id AS value, name FROM types_of_questions;';
			if ($mysqli->query($sql) == TRUE) {
				if($result = $mysqli->query($sql)){
					$typesOfQuestions = [];
					while($row = $result->fetch_array()) {
						unset($row[0]);
						unset($row[1]);
						$typesOfQuestions[] = $row;
					}
					$res['typesOfQuestions'] = $typesOfQuestions;
					$result->free();
				} else {
					$res['error'] = "Error: " . $mysqli->error;
				}
			} else {
				$res['error'] = "Error: " . $mysqli->error;
			}
		}
		$mysqli->close();
		echo json_encode($res);
		
	}

?>
